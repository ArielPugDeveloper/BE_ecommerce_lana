import { Router } from 'express';
import { getProducts, getProductById, addProduct, updateProductById, deleteProductById, findProductsByNameController, findProductsByColorController, findProductsByPriceRangeController} from '../controllers/product.controller.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js'; // Importa los middlewares
import { uploadImage, parseFormData } from '../middlewares/upload.middleware.js'; // Importa el middleware de subida

const router = Router();

// Rutas de lectura (abiertas a todos los usuarios, incluso los no autenticados)
router.get('/products', getProducts);


// Rutas de escritura (solo para superusuarios)
router.post('/products', authenticateToken, authorizeRole('SUPER_USER'), uploadImage, addProduct);
router.put('/products/:id', authenticateToken, authorizeRole('SUPER_USER'), uploadImage, updateProductById);
router.delete('/products/:id', authenticateToken, authorizeRole('SUPER_USER'), deleteProductById);


router.get('/products/search/name', findProductsByNameController);
router.get('/products/search/color', findProductsByColorController);
router.get('/products/search/price', findProductsByPriceRangeController);

export default router;