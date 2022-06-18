import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products-controller';
import { adminMiddleware, authMiddleware } from '../middlewares/auth-middlewares';

const productsRouter = Router();

productsRouter.get('/', getProducts);
productsRouter.get('/:id', getProduct);
productsRouter.post('/', authMiddleware, adminMiddleware, createProduct);
productsRouter.patch('/:id', authMiddleware, adminMiddleware, updateProduct);
productsRouter.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default productsRouter;
