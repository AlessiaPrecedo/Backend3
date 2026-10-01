import { faker } from "@faker-js/faker";

import { DELIVERY_STATUS, MOCKING_PARAMETERS } from "../constants/index.js";

const mockeables_deliveries = () => [
  DELIVERY_STATUS.PENDING,
  DELIVERY_STATUS.ASSIGNED,
  DELIVERY_STATUS.IN_TRANSIT,
  DELIVERY_STATUS.DELIVERED,
];

export const generateMockDelivery = () => {
  const status = faker.helpers.arrayElement(mockeables_deliveries());

  const delivery = {
    order: faker.string.uuid(),
    driver: faker.string.uuid(),

    status,

    priority: faker.helpers.arrayElement(["low", "normal", "high"]),

    assignedAt: status !== DELIVERY_STATUS.PENDING ? faker.date.recent() : null,

    deliveredAt:
      status === DELIVERY_STATUS.DELIVERED ? faker.date.recent() : null,
  };

  return delivery;
};
export const generateMockDeliveries = (qty = MOCKING_PARAMETERS.DEFAULT) => {
  const deliveries = [];

  for (let i = 0; i < qty; i++) {
    deliveries.push(generateMockDelivery());
  }

  return deliveries;
};
