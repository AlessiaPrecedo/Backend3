import { ProductRepository } from "../repositories/product.repository.js";
import {
  ProductAlreadyExistsError,
  ProductNotFoundError,
} from "../errors/app.error.js";
import logger from "../utils/logger.js";

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

    const product = await ProductRepository.create(productData);
    logger.info("Product created", { productId: product._id.toString() });
    return product;
  },

  async updateProduct(id, productData) {
    const product = await ProductRepository.update(id, productData);
    if (!product) {
      throw new ProductNotFoundError();
    }
    logger.info("Product updated", { productId: product._id.toString() });
    return product;
  },

  async deleteProduct(id) {
    const product = await ProductRepository.delete(id);
    if (!product) {
      throw new ProductNotFoundError();
    }
    logger.info("Product deleted", { productId: product._id.toString() });
    return product;
  },
};
