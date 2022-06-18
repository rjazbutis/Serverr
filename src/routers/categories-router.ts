import { Router } from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categories-controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth-middlewares';

const categoriesRouter = Router();

categoriesRouter.get('/', getCategories);
categoriesRouter.get('/:id', getCategory);
categoriesRouter.post('/', authMiddleware, adminMiddleware, createCategory);
categoriesRouter.patch('/:id', authMiddleware, adminMiddleware, updateCategory);
categoriesRouter.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

export default categoriesRouter;
