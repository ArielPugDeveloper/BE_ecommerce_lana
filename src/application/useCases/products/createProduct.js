import { productRepository } from '../../../infrastructure/repositories/product.repository.js';
import { Product } from '../../../domain/entities/product.entity.js'; // Asegúrate de que tu entidad existe


export const createProduct = async (productData) => {
  const newProduct = new Product(productData);
  return await productRepository.create(newProduct);
};