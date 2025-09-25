import { productRepository } from '../../../infrastructure/repositories/product.repository.js';

export const findManyProducts = async () => {
  // Aquí podría haber lógica de negocio adicional (validaciones, etc.)
  return await productRepository.findMany();
};