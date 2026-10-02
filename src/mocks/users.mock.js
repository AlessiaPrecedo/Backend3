import { faker } from "@faker-js/faker";
import { USER_ROLES, MOCKING_PARAMETERS } from "../constants/index.js";

const mockeables_roles = [
  USER_ROLES.CUSTOMER,
  USER_ROLES.DRIVER,
  USER_ROLES.STORE,
];

export const generateMockUser = (role) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet
    .email({ firstName, lastName })
    .toLocaleLowerCase();
  const userRole = role ?? faker.helpers.arrayElement(mockeables_roles);
  const defaultPassword = MOCKING_PARAMETERS.DEFAULT_PASSWORD;

  const user = {
    firstName,
    lastName,
    email,
    password: defaultPassword,
    role: userRole,
  };
  return user;
};
export const generateMockUsers = (qty, role) => {
  const usersData = [];

  for (let i = 0; i < qty; i++) {
    usersData.push(generateMockUser(role));
  }

  return usersData;
};
