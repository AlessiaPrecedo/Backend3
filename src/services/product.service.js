import { ProductRepository } from "../repositories/product.repository.js";

export const ProductService = {
  async getProducts() {
    return await ProductRepository.findAll();
  },

  async getProductById(id) {
    return await ProductRepository.findById(id);
  },

  async createProduct(productData) {
    const existingProduct = await ProductRepository.findByName(
      productData.name,
    );

    if (existingProduct) {
      throw new Error("A product with this name already exists.");
    }

    return await ProductRepository.create(productData);
  },

  async updateProduct(id, productData) {
    return await ProductRepository.update(id, productData);
  },

  async deleteProduct(id) {
    return await ProductRepository.delete(id);
  },
};
