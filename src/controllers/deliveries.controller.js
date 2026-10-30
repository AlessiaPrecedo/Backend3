import { DeliveryService } from "../services/deliveries.service.js";

export const getAllDeliveries = async (req, res) => {
  const deliveries = await DeliveryService.getAllDeliveries();
  res.json(deliveries);
};

export const getDeliveryById = async (req, res) => {
  const delivery = await DeliveryService.getDeliveryById(req.params.id);
  if (!delivery) {
    return res.status(404).json({
      status: "error",
      error: "DELIVERY_NOT_FOUND",
      message: "Delivery not found",
    });
  }
  return res.json(delivery);
};
