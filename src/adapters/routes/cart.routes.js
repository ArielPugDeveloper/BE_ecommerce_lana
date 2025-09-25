import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { addToCartController, getCartController, deleteProductCartController,  increaseProductQuantityController,
  decreaseProductQuantityController, clearCartController
 } from '../controllers/cart.controller.js';

const router = Router();


router.post('/cart/add', authenticateToken, addToCartController);
router.get('/cart', authenticateToken, getCartController);
router.put('/cart/increase', authenticateToken, increaseProductQuantityController);
router.put('/cart/decrease', authenticateToken, decreaseProductQuantityController);
router.delete('/cart/product/:productId', authenticateToken, deleteProductCartController);
router.delete('/cart/clear', authenticateToken, clearCartController);



export default router;