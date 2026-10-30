import Order from "../models/order.model.js";

export const OrderRepository = {
  async findAll() {
    return await Order.find();
  },
  async findById(id) {
    return await Order.findById(id);
  },
  async createMany(orders, options = {}) {
    return Order.insertMany(orders, options);
  },
  async deleteManyByIds(ids) {
    return Order.deleteMany({ _id: { $in: ids } });
  },
};
