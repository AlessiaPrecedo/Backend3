import { UserService } from "../services/users.service.js";

export const getAllUsers = async (req, res) => {
  const users = await UserService.getAllUsers();
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await UserService.getUserById(req.params.id);
  res.json(user);
};

export const createUser = async (req, res) => {
  const newUser = await UserService.createUser(req.body);
  res.status(201).json(newUser);
};
export const updateUser = async (req, res) => {
  const updatedUser = await UserService.updateUser(req.params.id, req.body);
  res.json(updatedUser);
};
export const deleteUser = async (req, res) => {
  await UserService.deleteUser(req.params.id);
  res.status(200).json({ message: "User deleted successfully" });
};
