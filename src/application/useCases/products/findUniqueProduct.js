import { productRepository } from '../../../infrastructure/repositories/product.repository.js';

export const findUniqueProduct = async (id) => {
  return await productRepository.findOne(parseInt(id));
};