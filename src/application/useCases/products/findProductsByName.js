import { productRepository } from '../../../infrastructure/repositories/product.repository.js';

export const findProductsByName = async (name) => {
  return await productRepository.findByName(name);
};