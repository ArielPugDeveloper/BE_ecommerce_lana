import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deleteUser = async (userId) => {
  try {
    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar que el usuario no es SUPER_USER
    if (user.role === 'SUPER_USER') {
      throw new Error('No se puede eliminar un SUPER_USER');
    }

    // Usar una transacción para eliminar todas las relaciones dependientes
    await prisma.$transaction(async (tx) => {
      // 1. Eliminar productos del carrito del usuario
      const cart = await tx.cart.findUnique({
        where: { userId: userId }
      });

      if (cart) {
        // Eliminar todos los productos del carrito
        await tx.cartProduct.deleteMany({
          where: { cartId: cart.id }
        });
        
        // Eliminar el carrito
        await tx.cart.delete({
          where: { id: cart.id }
        });
      }

      // 2. Eliminar productos de las órdenes del usuario
      const orders = await tx.order.findMany({
        where: { userId: userId }
      });

      for (const order of orders) {
        // Eliminar productos de cada orden
        await tx.orderProduct.deleteMany({
          where: { orderId: order.id }
        });
        
        // Eliminar la orden
        await tx.order.delete({
          where: { id: order.id }
        });
      }

      // 3. Finalmente, eliminar el usuario
      await tx.user.delete({
        where: { id: userId }
      });
    });

    return { message: 'Usuario eliminado correctamente' };
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};
