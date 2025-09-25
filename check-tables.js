import { PrismaClient } from './src/infrastructure/generated/prisma/index.js';
const prisma = new PrismaClient();

async function checkTables() {
  try {
    console.log('🔍 Verificando conexión a Railway...');
    
    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión exitosa a Railway!');
    
    // Listar todas las tablas en la base de datos
    console.log('\n📋 Verificando tablas existentes...');
    
    try {
      // Intentar obtener información de las tablas
      const tables = await prisma.$queryRaw`
        SELECT TABLE_NAME 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = 'productos_lana'
      `;
      
      console.log('📊 Tablas encontradas en la base de datos:');
      tables.forEach(table => {
        console.log(`   - ${table.TABLE_NAME}`);
      });
      
    } catch (error) {
      console.log('❌ Error al listar tablas:', error.message);
    }
    
    // Probar cada modelo de Prisma individualmente
    console.log('\n🧪 Probando cada modelo...');
    
    const models = ['Product', 'User', 'Cart', 'CartProduct', 'Order', 'OrderProduct'];
    
    for (const model of models) {
      try {
        console.log(`\n   Probando modelo: ${model}`);
        
        if (model === 'Product') {
          const count = await prisma.product.count();
          console.log(`   ✅ Product: ${count} registros encontrados`);
        } else if (model === 'User') {
          const count = await prisma.user.count();
          console.log(`   ✅ User: ${count} registros encontrados`);
        } else if (model === 'Cart') {
          const count = await prisma.cart.count();
          console.log(`   ✅ Cart: ${count} registros encontrados`);
        } else if (model === 'CartProduct') {
          const count = await prisma.cartProduct.count();
          console.log(`   ✅ CartProduct: ${count} registros encontrados`);
        } else if (model === 'Order') {
          const count = await prisma.order.count();
          console.log(`   ✅ Order: ${count} registros encontrados`);
        } else if (model === 'OrderProduct') {
          const count = await prisma.orderProduct.count();
          console.log(`   ✅ OrderProduct: ${count} registros encontrados`);
        }
        
      } catch (error) {
        console.log(`   ❌ ${model}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.log('❌ Error general:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
