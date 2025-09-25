import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Intentando conectar a la base de datos...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Configurada' : 'No configurada');
    
    await prisma.$connect();
    console.log('✅ Conexión exitosa a Railway!');
    
    const products = await prisma.product.findMany();
    console.log(`✅ Encontrados ${products.length} productos`);
    console.log('Primeros productos:', products.slice(0, 3));
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('Error completo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();