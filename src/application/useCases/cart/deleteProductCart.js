import { cartRepository } from '../../../infrastructure/repositories/cart.repository.js';

export const deleteProductCart = async (userId, productId) => {
  if (!userId || !productId) {
    throw new Error('Faltan datos del usuario o del producto para eliminar del carrito.');
  }
  return await cartRepository.deleteProduct(userId, productId);
};