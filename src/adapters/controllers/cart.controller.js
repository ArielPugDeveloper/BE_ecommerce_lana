import { addToCart } from '../../application/useCases/cart/addToCart.js';
import { getCart } from '../../application/useCases/cart/getCart.js';
import { deleteProductCart } from '../../application/useCases/cart/deleteProductCart.js';
import { clearCart } from '../../application/useCases/cart/clearCart.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addToCartController = async (req, res) => {
  try {
    const userId = req.user.id; // Asume que el ID del usuario viene del token
    const { productId, quantity } = req.body;

    const cartProduct = await addToCart(userId, productId, quantity);
    res.status(200).json(cartProduct);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: 'No se pudo agregar el producto al carrito.' });
  }
};

export const getCartController = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await getCart(userId);
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ error: 'No se pudo obtener el carrito.' });
  }
};

export const deleteProductCartController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await deleteProductCart(userId, parseInt(productId));
    res.status(200).json({ message: 'Producto eliminado del carrito correctamente.' });
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ error: 'No se pudo eliminar el producto del carrito.' });
  }
};

export const increaseProductQuantityController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const cartProduct = await prisma.cartProduct.findFirst({
      where: {
        cart: { userId },
        productId,
      },
      include: {
        product: true,
      },
    });

    if (!cartProduct) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito.' });
    }

    const updatedCartProduct = await prisma.cartProduct.update({
      where: { id: cartProduct.id },
      data: { quantity: { increment: 1 } },
      include: {
        product: true,
      },
    });

    res.status(200).json(updatedCartProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al aumentar la cantidad del producto.' });
  }
};

export const decreaseProductQuantityController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const cartProduct = await prisma.cartProduct.findFirst({
      where: {
        cart: { userId },
        productId,
      },
    });

    if (!cartProduct) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito.' });
    }

    if (cartProduct.quantity <= 1) {
      // Si la cantidad es 1 o menos, lo eliminamos
      await prisma.cartProduct.delete({
        where: { id: cartProduct.id },
      });
      return res.status(200).json({ message: 'Producto eliminado del carrito.' });
    }

    const updatedCartProduct = await prisma.cartProduct.update({
      where: { id: cartProduct.id },
      data: { quantity: { decrement: 1 } },
    });

    res.status(200).json(updatedCartProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al disminuir la cantidad del producto.' });
  }
};

export const clearCartController = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await clearCart(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al vaciar el carrito:', error);
    res.status(500).json({ error: 'No se pudo vaciar el carrito.' });
  }
};