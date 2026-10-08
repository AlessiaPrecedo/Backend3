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
import {
  DatabaseUnavailableError,
  InvalidMockAmountError,
  InvalidMockTypeError,
  MockPersistenceError,
} from "../errors/app.error.js";

const resolveQuantity = (quantity = MOCKING_PARAMETERS.DEFAULT) => {
  const parsedQuantity = Number(quantity);
  if (
    !Number.isInteger(parsedQuantity) ||
    parsedQuantity < 1 ||
    parsedQuantity > MOCKING_PARAMETERS.MAX
  ) {
    throw new InvalidMockAmountError(MOCKING_PARAMETERS.MAX);
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
      throw new InvalidMockTypeError(type);
    }
    return selectors[type](createMockData(parsedQuantity));
  },

  async persistBundle(quantity) {
    const parsedQuantity = resolveQuantity(quantity);
    if (mongoose.connection.readyState !== 1) {
      throw new DatabaseUnavailableError();
    }

    const data = createMockData(parsedQuantity);
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
      const cleanupResults = await Promise.allSettled([
        DeliveryRepository.deleteManyByIds(ids.deliveries),
        OrderRepository.deleteManyByIds(ids.orders),
        UserRepository.deleteManyByIds(ids.users),
      ]);
      const rollbackErrors = cleanupResults
        .filter((result) => result.status === "rejected")
        .map((result) => result.reason?.message || "rollback failed");
      throw new MockPersistenceError({
        cause: error.message,
        rollbackErrors,
      });
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
