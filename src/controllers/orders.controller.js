import { OrderService } from "../services/orders.service.js";

export const getAllOrders = async (req, res) => {
  const orders = await OrderService.getAllOrders();
  res.json(orders);
};

export const getOrderById = async (req, res) => {
  const order = await OrderService.getOrderById(req.params.id);
  return res.json(order);
};

export const createOrder = async (req, res) => {
  const newOrder = await OrderService.createOrder(req.body);
  res.status(201).json(newOrder);
};
