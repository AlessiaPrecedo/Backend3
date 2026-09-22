import { UserRepository } from "../repositories/users.repository.js";
import { USER_ROLES } from "../constants/index.js";

export const UserService = {
  async getAllUsers() {
    return await UserRepository.findAll();
  },
  async getUserById(id) {
    return await UserRepository.findById(id);
  },
  async createUser(userData) {
    const existingUser = await UserRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new Error("This email is already registered.");
    }

    if (!userData.role) {
      userData.role = USER_ROLES.CUSTOMER;
    }
    return await UserRepository.create(userData);
  },
  async updateUser(id, userData) {
    return await UserRepository.update(id, userData);
  },
  async deleteUser(id) {
    return await UserRepository.delete(id);
  },
};
