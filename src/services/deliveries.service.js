import { DeliveryRepository } from "../repositories/deliveries.repository.js";

export const DeliveryService = {
  async getAllDeliveries() {
    return await DeliveryRepository.findAll();
  },

  async getDeliveryById(id) {
    return await DeliveryRepository.findById(id);
  },
};
