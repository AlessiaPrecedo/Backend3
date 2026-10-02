import Delivery from "../models/delivery.model.js";

export const DeliveryRepository = {
  async createMany(deliveries, options = {}) {
    return Delivery.insertMany(deliveries, options);
  },
  async deleteManyByIds(ids) {
    return Delivery.deleteMany({ _id: { $in: ids } });
  },
};
