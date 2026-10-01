import { UserRepository } from "../repositories/user.repository.js";

export const MockService = {
  async getUsers() {
    return await UserRepository.findAll();
  },

  async getUserById(id) {
    return await UserRepository.findById(id);
  },

  async createUser(userData) {
    const existingUser = await UserRepository.findByEmail(userData.email);
  },

  if(existingUser) {
    throw new Error("A user with this email already exists.");
  },

  async updateUser(id, userData) {
    return await UserRepository.updateById(id, userData);
  },

  async deleteUser(id) {
    return await UserRepository.deleteById(id);
  },
};
