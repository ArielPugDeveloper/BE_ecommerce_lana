import { findManyProducts } from '../../application/useCases/products/findManyProducts.js';
import { findUniqueProduct } from '../../application/useCases/products/findUniqueProduct.js';
import { createProduct } from '../../application/useCases/products/createProduct.js';
import { updateProduct } from '../../application/useCases/products/updateProduct.js';
import { deleteProduct } from '../../application/useCases/products/deleteProduct.js';
import { createProductDTO } from '../../application/dtos/products/createProductDTO.js';
import { productResponseDTO } from '../../application/dtos/products/productResponseDTO.js';
import { uploadImage } from '../../infrastructure/services/cloudinary.service.js';
import { findProductsByName } from '../../application/useCases/products/findProductsByName.js';
import { findProductsByColor } from '../../application/useCases/products/findProductsByColor.js';
import fs from 'fs';
import { findProductsByPriceRange } from '../../application/useCases/products/findProductsByPriceRange.js';

//Controlador para mostrar todos los productos
export const getProducts = async (req, res) => {
  try {
    const products = await findManyProducts();
    // Usa el DTO de salida para formatear la respuesta de la lista
    const productsDTO = products.map(product => new productResponseDTO(product));
    res.json(productsDTO);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error al obtener los productos.' });
  }
};

//Controlador para mostrar un producto en especifico
export const getProductById = async (req, res) => {
  try {
    const product = await findUniqueProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    // Usa el DTO de salida para formatear la respuesta del producto
    const productDTO = new productResponseDTO(product);
    res.json(productDTO);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error al obtener el producto.' });
  }
};


//Controlador para crear un producto
export const addProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ninguna imagen para el producto.' });
    }

    // 1. Subir la imagen a Cloudinary
    const result = await uploadImage(req.file.path);
    const image_url = result.secure_url;

    // 2. Eliminar el archivo temporal
    fs.unlinkSync(req.file.path);

    // 3. Combinar los datos del body con la URL de la imagen
    const productDataWithImage = {
      ...req.body,
      image_url,
    };

    // 4. Usar el DTO para validar y limpiar los datos
    const createProductDto = new createProductDTO(productDataWithImage);

    // 5. Crear el producto en la base de datos
    const newProduct = await createProduct(createProductDto);

    // 6. Usar el DTO de respuesta para formatear la respuesta
    const productDTO = new productResponseDTO(newProduct);
    res.status(201).json(productDTO);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const updateProductById = async (req, res) => {
  try {
    console.log('Actualizando producto con ID:', req.params.id);
    console.log('Datos recibidos:', req.body);
    console.log('Archivo recibido:', req.file);
    
    // Combinar req.body con la información del archivo si existe
    const updateData = { ...req.body };
    
    // Si se subió una nueva imagen, procesarla igual que en la creación
    if (req.file) {
      console.log('Procesando nueva imagen:', req.file.filename);
      
      // 1. Subir la imagen a Cloudinary
      const result = await uploadImage(req.file.path);
      const image_url = result.secure_url;
      console.log('Imagen subida a Cloudinary:', image_url);
      
      // 2. Eliminar el archivo temporal
      fs.unlinkSync(req.file.path);
      
      // 3. Incluir la URL de la imagen en los datos de actualización
      updateData.image_url = image_url;
    }
    
    const updatedProduct = await updateProduct(req.params.id, updateData);
    console.log('Producto actualizado exitosamente:', updatedProduct);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error en updateProductById:', error);
    res.status(500).json({ error: 'Hubo un error al actualizar el producto.' });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const deletedProduct = await deleteProduct(req.params.id);
    res.json(deletedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error al eliminar el producto.' });
  }
};

export const findProductsByNameController = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ error: 'El nombre del producto es requerido.' });
    }
    const products = await findProductsByName(name);
    const productsDTO = products.map(product => new productResponseDTO(product));
    res.status(200).json(productsDTO);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const findProductsByColorController = async (req, res) => {
  try {
    const { color } = req.query;
    if (!color) {
      return res.status(400).json({ error: 'El color del producto es requerido.' });
    }
    const products = await findProductsByColor(color);
    const productsDTO = products.map(product => new productResponseDTO(product));
    res.status(200).json(productsDTO);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const findProductsByPriceRangeController = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    const parsedMinPrice = minPrice ? parseFloat(minPrice) : undefined;
    const parsedMaxPrice = maxPrice ? parseFloat(maxPrice) : undefined;

    // Validar que si se proporciona un precio, sea un número válido
    if ((minPrice && isNaN(parsedMinPrice)) || (maxPrice && isNaN(parsedMaxPrice))) {
      return res.status(400).json({ error: 'Los precios deben ser números válidos.' });
    }

    // Validar que al menos uno de los precios esté definido
    if (parsedMinPrice === undefined && parsedMaxPrice === undefined) {
      return res.status(400).json({ error: 'Debe proporcionar al menos un precio mínimo o máximo.' });
    }

    const products = await findProductsByPriceRange(parsedMinPrice, parsedMaxPrice);
    
    const productsDTO = products.map(product => new productResponseDTO(product));
    
    res.status(200).json(productsDTO);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};