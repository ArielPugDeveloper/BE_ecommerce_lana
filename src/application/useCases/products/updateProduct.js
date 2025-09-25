import { productRepository } from '../../../infrastructure/repositories/product.repository.js';

export const updateProduct = async (id, data) => {
  console.log('updateProduct llamado con ID:', id, 'y datos:', data);
  
  const productToUpdate = await productRepository.findOne(parseInt(id));
  if (!productToUpdate) {
    console.log('Producto no encontrado para ID:', id);
    throw new Error('Producto no encontrado.');
  }

  console.log('Producto encontrado:', productToUpdate);

  const dataToUpdate = { ...data };
  if (data.price) {
    dataToUpdate.price = parseFloat(data.price);
    console.log('Precio convertido a float:', dataToUpdate.price);
  }
  if (data.stock) {
    dataToUpdate.stock = parseInt(data.stock);
    console.log('Stock convertido a int:', dataToUpdate.stock);
  }

  console.log('Datos finales para actualizar:', dataToUpdate);
  const result = await productRepository.update(parseInt(id), dataToUpdate);
  console.log('Resultado de la actualización:', result);
  
  return result;
};