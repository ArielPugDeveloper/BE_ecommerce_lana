import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const cartRepository = {
  // Obtiene el carrito de un usuario incluyendo los productos que tiene dentro
  async getCart(userId) {
    return await prisma.cart.findUnique({
      where: { userId },
      include: {
        products: {
          include: {
            product: true, // Incluye la información completa del producto
          },
        },
      },
    });
  },

  // Agrega un producto al carrito, o actualiza la cantidad si ya existe
  async addProduct(userId, productId, quantity) {
    // Busca si el carrito del usuario ya existe
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    // Si no existe, crea un nuevo carrito para el usuario
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Busca si el producto ya está en el carrito
    const existingCartProduct = await prisma.cartProduct.findFirst({
      where: { cartId: cart.id, productId },
    });

    // Si el producto ya está, solo actualiza la cantidad
    if (existingCartProduct) {
      return await prisma.cartProduct.update({
        where: { id: existingCartProduct.id },
        data: { quantity: existingCartProduct.quantity + quantity },
      });
    } else {
      // Si el producto no está, lo agrega al carrito
      return await prisma.cartProduct.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }
  },

  // Elimina un producto específico del carrito
  async deleteProduct(userId, productId) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new Error('No se encontró el carrito.');
    }

    const cartProduct = await prisma.cartProduct.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (cartProduct) {
      return await prisma.cartProduct.delete({
        where: { id: cartProduct.id },
      });
    }

    throw new Error('Producto no encontrado en el carrito.');
  },

  // Vacía el carrito de un usuario
  async clearCart(userId) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return null;
    }

    return await prisma.cartProduct.deleteMany({
      where: { cartId: cart.id },
    });
  },
};