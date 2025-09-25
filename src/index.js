import express from 'express';
import productRoutes from './adapters/routes/product.routes.js';
import userRoutes from './adapters/routes/user.routes.js'; 
import orderRoutes from './adapters/routes/order.routes.js';
import cartRoutes from './adapters/routes/cart.routes.js';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = 3000;

// Configura CORS para permitir peticiones desde tu frontend
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Hola desde el servidor del backend del e-commerce!');
});

app.use('/api', productRoutes);
app.use('/api', userRoutes); // Conecta las nuevas rutas
app.use('/api', orderRoutes);
app.use('/api', cartRoutes);


app.listen(PORT, () => {
  console.log(`El servidor está corriendo en http://localhost:${PORT}`);
});



/* INDEX CON CRUD FUNCIONAL SIN MODULARIZAR

import express from 'express';  //Importamos express
import { PrismaClient } from '@prisma/client';  //Importamos el ORM Prisma

const app = express();  // variable para usar express

app.use(express.json()); //Este es un middleware que le dice a Express que analice el cuerpo de las peticiones entrantes que tengan un formato JSON.

const prismaClient = new PrismaClient(); // variable para usar el ORM
const PORT = 3000; //puerto

// Una ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola desde el servidor del backend del e-commerce!');
});

// Ruta para obtener todos los productos usando el ORM 
app.get('/api/products', async (req, res) => { //Define una ruta GET y Declara la función como asíncrona porque es una operación que toma tiempo (accede a la base de datos).
  try {
    const products = await prismaClient.product.findMany(); // Este es el poder del ORM. Le dice a Prisma que busque todos los registros en la tabla product y espera a que los datos se devuelvan.
    res.json(products); //Una vez que los productos se obtienen, el servidor los envía al cliente en formato JSON.
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error al obtener los productos.' }); // Es una buena práctica para manejar errores. Si algo sale mal con la base de datos, el servidor responderá con un código de estado 500
  }
});

app.post('/api/products', async (req, res) => { //Define una ruta que solo acepta peticiones POST.
  try {
    const { name, color, description, price, stock, image_url } = req.body; // Extrae los datos del cuerpo de la petición 
    const newProduct = await prismaClient.product.create({ //Aquí usamos el método create de Prisma para insertar un nuevo registro en la tabla product. El objeto data contiene la información del nuevo producto.
      data: {
        name,
        color,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        image_url,
      },
    });
    res.status(201).json(newProduct); //Si la creación es exitosa, se envía una respuesta con el código de estado 201 (Creado) y los datos del producto recién creado en formato JSON.
  } catch (error) {
    console.error(error); // Para ver el error completo en la terminal
    res.status(500).json({ error: 'Hubo un error al crear el producto.' });
  }
});

app.get('/api/products/:id', async (req, res) => { //El :id en la URL es un parámetro dinámico. Express lo captura y lo pone en el objeto req.params.
  try {
    const { id } = req.params; //Extrae el id de los parámetros de la URL.
    const product = await prismaClient.product.findUnique({ //Aquí usamos el método findUnique de Prisma para buscar un solo registro por su clave única, en este caso, el id.
      where: {
        id: parseInt(id), //El id que viene de la URL es una cadena de texto, pero tu base de datos lo espera como un número entero. parseInt() se encarga de la conversión.
      },
    });

    if (!product) { //Si Prisma no encuentra un producto con el id dado, findUnique devuelve null. Con esta validación, enviamos una respuesta 404 Not Found al cliente.
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al obtener el producto.' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, description, price, stock, image_url } = req.body;
    
    // El objeto 'data' solo incluirá los campos que se enviaron en el body
    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (color) dataToUpdate.color = color;
    if (description) dataToUpdate.description = description;
    if (price) dataToUpdate.price = parseFloat(price);
    if (stock) dataToUpdate.stock = parseInt(stock);
    if (image_url) dataToUpdate.image_url = image_url;
    
    const updatedProduct = await prismaClient.product.update({
      where: {
        id: parseInt(id),
      },
      data: dataToUpdate, // Usamos el objeto con los datos enviados
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al actualizar el producto.' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await prismaClient.product.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.json(deletedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al eliminar el producto.' });
  }
});


app.listen(PORT, () => {
  console.log(`El servidor está corriendo en http://localhost:${PORT}`);
});

*/