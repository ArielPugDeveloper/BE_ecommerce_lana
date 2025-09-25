import { productRepository } from '../../../infrastructure/repositories/product.repository.js';

export const findProductsByPriceRange = async (minPrice, maxPrice) => {
  return await productRepository.findByPriceRange(minPrice, maxPrice);
};