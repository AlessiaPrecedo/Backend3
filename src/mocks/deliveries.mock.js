import { faker } from "@faker-js/faker";

import {
  DELIVERY_STATUS,
  MOCKING_PARAMETERS,
  DELIVERY_PRIORITY,
} from "../constants/index.js";

const mockeables_deliveries = () => [
  DELIVERY_STATUS.PENDING,
  DELIVERY_STATUS.ASSIGNED,
  DELIVERY_STATUS.IN_TRANSIT,
  DELIVERY_STATUS.DELIVERED,
];

export const generateMockDelivery = ({ order, driver, status, priority } = {}) => {
  const deliveryStatus = status ?? faker.helpers.arrayElement(mockeables_deliveries());

  const delivery = {
    order,
    driver,

    status: deliveryStatus,

    priority: priority ?? faker.helpers.arrayElement(Object.values(DELIVERY_PRIORITY)),

    assignedAt: deliveryStatus !== DELIVERY_STATUS.PENDING ? faker.date.recent() : null,

    deliveredAt:
      deliveryStatus === DELIVERY_STATUS.DELIVERED ? faker.date.recent() : null,
  };

  return delivery;
};
export const generateMockDeliveries = (qty = MOCKING_PARAMETERS.DEFAULT, options = []) => {
  const deliveries = [];

  for (let i = 0; i < qty; i++) {
    deliveries.push(generateMockDelivery(options[i]));
  }

  return deliveries;
};
