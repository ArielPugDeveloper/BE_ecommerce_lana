import { createOrder } from '../../application/useCases/orders/createOrder.js';
import { getCart } from '../../application/useCases/cart/getCart.js';
import { cartRepository } from '../../infrastructure/repositories/cart.repository.js';
import { sendTelegramNotification } from '../../infrastructure/services/telegram.service.js'; // Nueva importación

export const createOrderController = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const cart = await getCart(userId);

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: 'El carrito de compras está vacío.' });
    }
    
    const orderPayload = {
      userId: userId,
      products: cart.products.map(p => ({
        id: p.productId,
        quantity: p.quantity,
        price: p.product.price
      })),
      total: cart.products.reduce((acc, p) => acc + (p.quantity * p.product.price), 0)
    };

    const newOrder = await createOrder(orderPayload);
    
    await sendTelegramNotification(newOrder);

    await cartRepository.clearCart(userId);

    res.status(201).json(newOrder);
  } catch (error) {
      console.error('Error al procesar el pedido:', error);
      res.status(500).json({ error: 'No se pudo procesar el pedido.' });
  }
};



