import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth-middlewares';
import { singleUploadMiddleware } from '../middlewares/upload-middleware';
import {
  checkEmail,
  login,
  register,
  authenticate,
  updateUser,
} from '../controllers/auth-controller';

const authRouter = Router();

authRouter.get('/check-email', checkEmail);
authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/authenticate', authMiddleware, authenticate);
authRouter.patch('/update-user', authMiddleware, singleUploadMiddleware('img'), updateUser);

export default authRouter;
