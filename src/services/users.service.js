import { UserRepository } from "../repositories/users.repository.js";
import { USER_ROLES } from "../constants/index.js";
import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from "../errors/app.error.js";
import logger from "../utils/logger.js";

export const UserService = {
  async getAllUsers() {
    return await UserRepository.findAll();
  },
  async getUserById(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  },
  async createUser(userData) {
    const existingUser = await UserRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    if (!userData.role) {
      userData.role = USER_ROLES.CUSTOMER;
    }
    const user = await UserRepository.create(userData);
    logger.info("User created", {
      userId: user._id.toString(),
      role: user.role,
    });
    return user;
  },
  async updateUser(id, userData) {
    const user = await UserRepository.update(id, userData);
    if (!user) {
      throw new UserNotFoundError();
    }
    logger.info("User updated", { userId: user._id.toString() });
    return user;
  },
  async deleteUser(id) {
    const user = await UserRepository.delete(id);
    if (!user) {
      throw new UserNotFoundError();
    }
    logger.info("User deleted", { userId: user._id.toString() });
    return user;
  },
};
