import { Router } from 'express';
import { createOrderController } from '../controllers/order.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Ruta para crear un nuevo pedido
router.post('/orders', authenticateToken, createOrderController);

export default router;