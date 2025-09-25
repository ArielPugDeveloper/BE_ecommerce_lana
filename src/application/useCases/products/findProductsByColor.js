import { productRepository } from '../../../infrastructure/repositories/product.repository.js';

export const findProductsByColor = async (color) => {
  return await productRepository.findByColor(color);
};