import { ProductRepository } from "../repositories/product.repository.js";
import {
  ProductAlreadyExistsError,
  ProductNotFoundError,
} from "../errors/app.error.js";

export const ProductService = {
  async getProducts() {
    return await ProductRepository.findAll();
  },

  async getProductById(id) {
    const product = await ProductRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundError();
    }
    return product;
  },

  async createProduct(productData) {
    const existingProduct = await ProductRepository.findByName(
      productData.name,
    );

    if (existingProduct) {
      throw new ProductAlreadyExistsError();
    }

    return await ProductRepository.create(productData);
  },

  async updateProduct(id, productData) {
    const product = await ProductRepository.update(id, productData);
    if (!product) {
      throw new ProductNotFoundError();
    }
    return product;
  },

  async deleteProduct(id) {
    const product = await ProductRepository.delete(id);
    if (!product) {
      throw new ProductNotFoundError();
    }
    return product;
  },
};
