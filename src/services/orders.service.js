import { OrderRepository } from "../repositories/orders.repository.js";
import { OrderNotFoundError } from "../errors/app.error.js";

export const OrderService = {
  async getAllOrders() {
    return await OrderRepository.findAll();
  },

  async getOrderById(id) {
    const order = await OrderRepository.findById(id);
    if (!order) {
      throw new OrderNotFoundError();
    }
    return order;
  },

  async createOrder(orderData) {
    return await OrderRepository.create(orderData);
  },
};
