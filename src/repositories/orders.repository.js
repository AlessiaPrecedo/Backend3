import Order from "../models/order.model.js";

export const OrderRepository = {
  async findAll() {
    return await Order.find();
  },
  async findById(id) {
    return await Order.findById(id);
  },
  async create(orderData) {
    const order = new Order(orderData);
    return await order.save();
  },
  async createMany(orders, options = {}) {
    return Order.insertMany(orders, options);
  },
  async deleteManyByIds(ids) {
    return Order.deleteMany({ _id: { $in: ids } });
  },
};
