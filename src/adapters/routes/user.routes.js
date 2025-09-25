import { Router } from 'express';
import { registerUser, loginUser, updateUserController, validateToken, deleteUserController} from '../controllers/user.controller.js';
import { getAllUsers } from '../controllers/user.controller.js';
import { authenticateToken, authorizeRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/validate-token', authenticateToken, validateToken);
router.get('/users', authenticateToken, authorizeRole('SUPER_USER'), getAllUsers);
router.put('/users/:id', authenticateToken, updateUserController);
router.delete('/users/:id', authenticateToken, authorizeRole('SUPER_USER'), deleteUserController);
export default router;