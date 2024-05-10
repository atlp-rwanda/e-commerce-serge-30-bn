import express from 'express';
import { productsCategoryController } from '../controllers/products.category.controller';
import {
  validateSchema,
  categorySchema,
} from '../validations/category.validation';

const categoryRoutes = express.Router();

categoryRoutes.post(
  '/categories',
  validateSchema(categorySchema.category),
  productsCategoryController.createCategory,
);
categoryRoutes.get('/categories', productsCategoryController.getAllCategories);
categoryRoutes.get(
  '/categories/:category_id',
  productsCategoryController.getCategoryById,
);
categoryRoutes.patch(
  '/categories/:category_id',
  productsCategoryController.updateCategory,
);
categoryRoutes.delete(
  '/categories/:category_id',
  productsCategoryController.deleteCategory,
);

export default categoryRoutes;
