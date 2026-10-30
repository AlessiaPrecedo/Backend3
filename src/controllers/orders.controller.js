import { OrderService } from "../services/orders.service.js";

export const getAllOrders = async (req, res) => {
  const orders = await OrderService.getAllOrders();
  res.json(orders);
};

export const getOrderById = async (req, res) => {
  const order = await OrderService.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({
      status: "error",
      error: "ORDER_NOT_FOUND",
      message: "Order not found",
    });
  }
  return res.json(order);
};
