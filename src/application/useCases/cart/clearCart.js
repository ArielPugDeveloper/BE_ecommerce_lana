import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const clearCart = async (userId) => {
  try {
    // Buscar el carrito del usuario
    const cart = await prisma.cart.findFirst({
      where: { userId }
    });

    if (!cart) {
      // Si no existe carrito, crear uno vacío
      await prisma.cart.create({
        data: { userId }
      });
      return { message: 'Carrito vaciado correctamente.' };
    }

    // Eliminar todos los productos del carrito
    await prisma.cartProduct.deleteMany({
      where: { cartId: cart.id }
    });

    return { message: 'Carrito vaciado correctamente.' };
  } catch (error) {
    console.error('Error al vaciar el carrito:', error);
    throw new Error('No se pudo vaciar el carrito.');
  }
};
