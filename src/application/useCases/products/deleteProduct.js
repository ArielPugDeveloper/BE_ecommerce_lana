import { productRepository } from '../../../infrastructure/repositories/product.repository.js';

export const deleteProduct = async (id) => {
  const productToDelete = await productRepository.findOne(parseInt(id));
  if (!productToDelete) {
    throw new Error('Producto no encontrado.');
  }

  return await productRepository.remove(parseInt(id));
};