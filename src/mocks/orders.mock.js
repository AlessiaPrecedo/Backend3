import { faker } from "@faker-js/faker";

import {
  ORDER_STATUS,
  MOCKING_PARAMETERS,
  DELIVERY_PRIORITY,
} from "../constants/index.js";

const mockeables_statuses = () => [
  ORDER_STATUS.CREATED,
  ORDER_STATUS.ASSIGNED,
  ORDER_STATUS.PICKED_UP,
  ORDER_STATUS.IN_TRANSIT,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.CANCELLED,
];

const mockeables_priorities = () => [
  DELIVERY_PRIORITY.LOW,
  DELIVERY_PRIORITY.NORMAL,
  DELIVERY_PRIORITY.HIGH,
];

const generateMockOrderItem = () => ({
  name: faker.commerce.productName(),

  quantity: faker.number.int({
    min: 1,
    max: 10,
  }),

  price: faker.number.float({
    min: 10,
    max: 1000,
    fractionDigits: 2,
  }),
});

export const generateMockOrder = ({ customer, delivery = null, status } = {}) => {
  const orderStatus = status ?? faker.helpers.arrayElement(mockeables_statuses());

  const items = Array.from(
    {
      length: faker.number.int({ min: 1, max: 5 }),
    },
    generateMockOrderItem,
  );

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const order = {
    customer,

    items,

    deliveryAddress: faker.location.streetAddress(),

    total: Number(total.toFixed(2)),

    shippingCost: faker.number.float({
      min: 0,
      max: 500,
      fractionDigits: 2,
    }),

    declaredValue: Number(total.toFixed(2)),

    status: orderStatus,

    priority: faker.helpers.arrayElement(mockeables_priorities()),

    delivery,
  };

  return order;
};

export const generateMockOrders = (qty = MOCKING_PARAMETERS.DEFAULT, options = []) => {
  const orders = [];

  for (let i = 0; i < qty; i++) {
    orders.push(generateMockOrder(options[i]));
  }

  return orders;
};
