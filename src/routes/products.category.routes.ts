import express from 'express';
import { productsCategoryController } from '../controllers/products.category.controller';
import {
  validateSchema,
  categorySchema,
} from '../validations/category.validation';
import { isAuthorized } from '../middleware/user.authenticate';
import { UserRole } from '../models/user.model';
import { isAuthenticated } from '../middleware/authentication/auth.middleware';

const categoryRoutes = express.Router();

categoryRoutes.post(
  '/categories',
  isAuthenticated,
  isAuthorized(UserRole.ADMIN),
  validateSchema(categorySchema.category),
  productsCategoryController.createCategory,
);
categoryRoutes.get(
  '/categories/all',
  isAuthenticated,
  productsCategoryController.getAllCategories,
);
categoryRoutes.get(
  '/categories/:category_id',
  isAuthenticated,
  productsCategoryController.getCategoryById,
);
categoryRoutes.patch(
  '/categories/:category_id',
  isAuthenticated,
  isAuthorized(UserRole.ADMIN),
  validateSchema(categorySchema.update),
  productsCategoryController.updateCategory,
);
categoryRoutes.delete(
  '/categories/:category_id',
  isAuthenticated,
  isAuthorized(UserRole.ADMIN),
  productsCategoryController.deleteCategory,
);

export default categoryRoutes;
