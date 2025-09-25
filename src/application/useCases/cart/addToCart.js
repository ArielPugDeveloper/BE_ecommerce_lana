import { cartRepository } from '../../../infrastructure/repositories/cart.repository.js';

export const addToCart = async (userId, productId, quantity) => {
  if (!userId || !productId || !quantity) {
    throw new Error('Faltan datos del usuario o del producto para agregar al carrito.');
  }
  return await cartRepository.addProduct(userId, productId, quantity);
};