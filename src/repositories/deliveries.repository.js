import Delivery from "../models/delivery.model.js";

export const DeliveryRepository = {
  async findAll() {
    return await Delivery.find();
  },
  async findById(id) {
    return await Delivery.findById(id);
  },
  async createMany(deliveries, options = {}) {
    return Delivery.insertMany(deliveries, options);
  },
  async deleteManyByIds(ids) {
    return Delivery.deleteMany({ _id: { $in: ids } });
  },
};
