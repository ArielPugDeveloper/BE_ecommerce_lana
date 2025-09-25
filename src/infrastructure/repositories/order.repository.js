import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const orderRepository = {
  async create(orderData) {
    const newOrder = await prisma.order.create({
      data: {
        userId: orderData.userId,
        total: orderData.total,
        products: {
          createMany: {
            data: orderData.products.map((product) => ({
              productId: product.id,
              quantity: product.quantity,
              price: product.price,
            })),
          },
        },
      },
      include: {
        products: {
          include: {
            product: true
          }
        },
        user: true // Aquí incluimos la información completa del usuario
      },
    });
    return newOrder;
  },
  

  async findByUserId(userId) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { products: true },
    });
    return orders;
  },
};