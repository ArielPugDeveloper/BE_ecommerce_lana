import { cartRepository } from '../../../infrastructure/repositories/cart.repository.js';

export const getCart = async (userId) => {
  if (!userId) {
    throw new Error('Falta el ID de usuario para obtener el carrito.');
  }
  return await cartRepository.getCart(userId);
};