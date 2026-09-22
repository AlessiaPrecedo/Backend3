import Product from "../models/product.model.js";

export const ProductRepository = {
  async findAll() {
    return await Product.find();
  },
  async findById(id) {
    return await Product.findById(id);
  },
  async findByName(name) {
    return await Product.findOne({ name });
  },
  async create(productData) {
    const product = new Product(productData);
    return await product.save();
  },
  async update(id, productData) {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  },
  async delete(id) {
    return await Product.findByIdAndDelete(id);
  },
};
