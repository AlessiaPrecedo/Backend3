import { ProductService } from "../services/product.service.js";

export const getProducts = async (req, res) => {
  const products = await ProductService.getProducts();
  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await ProductService.getProductById(req.params.id);
  res.json(product);
};

export const createProduct = async (req, res) => {
  const newProduct = await ProductService.createProduct(req.body);
  res.status(201).json(newProduct);
};
export const updateProduct = async (req, res) => {
  const updatedProduct = await ProductService.updateProduct(
    req.params.id,
    req.body,
  );
  res.json(updatedProduct);
};
export const deleteProduct = async (req, res) => {
  await ProductService.deleteProduct(req.params.id);
  res.status(200).json({ message: "Product deleted successfully" });
};
