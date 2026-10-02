import mongoose from "mongoose";
import {
  DELIVERY_STATUS,
  MOCKING_PARAMETERS,
  ORDER_STATUS,
  USER_ROLES,
} from "../constants/index.js";
import { generateMockUsers } from "../mocks/users.mock.js";
import { generateMockOrders } from "../mocks/orders.mock.js";
import { generateMockDeliveries } from "../mocks/deliveries.mock.js";
import { DeliveryRepository } from "../repositories/deliveries.repository.js";
import { OrderRepository } from "../repositories/orders.repository.js";
import { UserRepository } from "../repositories/users.repository.js";
import { HttpError } from "../utils/errors.js";

const resolveQuantity = (quantity = MOCKING_PARAMETERS.DEFAULT) => {
  const parsedQuantity = Number(quantity);
  if (
    !Number.isInteger(parsedQuantity) ||
    parsedQuantity < 1 ||
    parsedQuantity > MOCKING_PARAMETERS.MAX
  ) {
    throw new HttpError(
      400,
      `Quantity must be an integer between 1 and ${MOCKING_PARAMETERS.MAX}.`,
    );
  }
  return parsedQuantity;
};

const deliveryStatusForOrder = (status) => {
  switch (status) {
    case ORDER_STATUS.ASSIGNED:
      return DELIVERY_STATUS.ASSIGNED;
    case ORDER_STATUS.PICKED_UP:
    case ORDER_STATUS.IN_TRANSIT:
      return DELIVERY_STATUS.IN_TRANSIT;
    case ORDER_STATUS.DELIVERED:
      return DELIVERY_STATUS.DELIVERED;
    case ORDER_STATUS.CREATED:
      return DELIVERY_STATUS.PENDING;
    default:
      return null;
  }
};

const createMockData = (
  quantity,
  driverQuantity = Math.max(1, Math.ceil(quantity / 3)),
) => {
  const customers = generateMockUsers(quantity, USER_ROLES.CUSTOMER).map(
    (user) => ({ _id: new mongoose.Types.ObjectId(), ...user }),
  );
  const drivers = generateMockUsers(driverQuantity, USER_ROLES.DRIVER).map(
    (user) => ({ _id: new mongoose.Types.ObjectId(), ...user }),
  );
  const orderIds = Array.from(
    { length: quantity },
    () => new mongoose.Types.ObjectId(),
  );
  const orders = generateMockOrders(
    quantity,
    orderIds.map((_, index) => ({
      customer: customers[index % customers.length]._id,
      delivery: null,
    })),
  ).map((order, index) => ({ ...order, _id: orderIds[index] }));

  const deliveryOptions = [];
  const deliveryIds = [];
  orders.forEach((order, index) => {
    const status = deliveryStatusForOrder(order.status);
    if (!status) return;

    const deliveryId = new mongoose.Types.ObjectId();
    order.delivery = deliveryId;
    deliveryIds.push(deliveryId);
    deliveryOptions.push({
      order: order._id,
      driver:
        status === DELIVERY_STATUS.PENDING
          ? null
          : drivers[index % drivers.length]._id,
      status,
      priority: order.priority,
    });
  });

  const deliveries = generateMockDeliveries(
    deliveryOptions.length,
    deliveryOptions,
  ).map((delivery, index) => ({ ...delivery, _id: deliveryIds[index] }));

  return { users: customers, drivers, orders, deliveries };
};

export const MocksService = {
  generateBundle(quantity) {
    return createMockData(resolveQuantity(quantity));
  },

  generate(type, quantity) {
    const parsedQuantity = resolveQuantity(quantity);
    if (type === "drivers") {
      return createMockData(parsedQuantity, parsedQuantity).drivers;
    }

    const selectors = {
      users: (data) => data.users,
      orders: (data) => data.orders,
      deliveries: (data) => data.deliveries,
    };
    if (!Object.hasOwn(selectors, type)) {
      throw new HttpError(404, `Unsupported mock type: ${type}`);
    }
    return selectors[type](createMockData(parsedQuantity));
  },

  async persistBundle(quantity) {
    if (mongoose.connection.readyState !== 1) {
      throw new HttpError(
        503,
        "MongoDB is not connected. Check MONGODB_URI and database credentials.",
      );
    }

    const data = createMockData(resolveQuantity(quantity));
    const users = [...data.users, ...data.drivers];
    const ids = {
      users: users.map(({ _id }) => _id),
      orders: data.orders.map(({ _id }) => _id),
      deliveries: data.deliveries.map(({ _id }) => _id),
    };

    try {
      await UserRepository.createMany(users);
      await OrderRepository.createMany(data.orders);
      if (data.deliveries.length) {
        await DeliveryRepository.createMany(data.deliveries);
      }
    } catch (error) {
      await Promise.allSettled([
        DeliveryRepository.deleteManyByIds(ids.deliveries),
        OrderRepository.deleteManyByIds(ids.orders),
        UserRepository.deleteManyByIds(ids.users),
      ]);
      throw error;
    }

    return {
      counts: {
        users: data.users.length,
        drivers: data.drivers.length,
        orders: data.orders.length,
        deliveries: data.deliveries.length,
      },
      data,
    };
  },
};
