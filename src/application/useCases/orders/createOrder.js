// src/application/useCases/orders/createOrder.js

import { orderRepository } from '../../../infrastructure/repositories/order.repository.js';

export const createOrder = async (orderData) => {
  try {
    // Aquí puedes agregar validaciones de productos y stock
    const newOrder = await orderRepository.create(orderData);
    
    // Este caso de uso solo devuelve el pedido creado.
    // La notificación se maneja en el controlador.
    return newOrder;
  } catch (error) {
    console.error('Error en el caso de uso createOrder:', error);
    throw new Error('No se pudo procesar el pedido.');
  }
};