import { PrismaClient } from '@prisma/client';
import { Product } from '../../domain/entities/product.entity.js';

const prisma = new PrismaClient();

export const productRepository = {
  findMany: async () => {
    const productsData = await prisma.product.findMany();
    return productsData.map(data => new Product(data));
  },

  findOne: async (id) => {
    const productData = await prisma.product.findUnique({
      where: {
        id,
      },
    });
    return productData ? new Product(productData) : null;
  },

  create: async (data) => {
    const newProductData = await prisma.product.create({ data });
    return new Product(newProductData);
  },

  update: async (id, data) => {
    const updatedProductData = await prisma.product.update({
      where: {
        id,
      },
      data,
    });
    return new Product(updatedProductData);
  },

  remove: async (id) => {
    // Usar transacción para eliminar primero las relaciones y luego el producto
    const deletedProductData = await prisma.$transaction(async (tx) => {
      // Eliminar primero todas las relaciones CartProduct
      await tx.cartProduct.deleteMany({
        where: { productId: id }
      });

      // Eliminar todas las relaciones OrderProduct
      await tx.orderProduct.deleteMany({
        where: { productId: id }
      });

      // Finalmente eliminar el producto
      return await tx.product.delete({
        where: { id }
      });
    });

    return new Product(deletedProductData);
  },

  async findByName(name) {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: name,

        },
      },
    });
    return products.map(product => new Product(product));
  },

  async findByColor(color) {
    const products = await prisma.product.findMany({
      where: {
        color: {
          contains: color,

        },
      },
    });
    return products.map(product => new Product(product));
  },

  async findByPriceRange(minPrice, maxPrice) {
    let whereClause = {};

    if (minPrice !== undefined && maxPrice !== undefined) {
      whereClause = { price: { gte: minPrice, lte: maxPrice } };
    } else if (minPrice !== undefined) {
      whereClause = { price: { gte: minPrice } };
    } else if (maxPrice !== undefined) {
      whereClause = { price: { lte: maxPrice } };
    }
    
    const products = await prisma.product.findMany({
      where: whereClause,
    });
    
    return products.map(product => new Product(product));
  },
};