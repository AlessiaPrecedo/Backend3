import { OrderRepository } from "../repositories/orders.repository.js";

export const OrderService = {
  async getAllOrders() {
    return await OrderRepository.findAll();
  },

  async getOrderById(id) {
    return await OrderRepository.findById(id);
  },
};
