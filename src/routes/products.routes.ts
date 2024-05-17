import express from 'express';
import { productsController } from '../controllers/products.controller';
import { isAuthenticated } from '../middleware/authentication/auth.middleware';
import {
  validateSchema,
  productSchema,
} from '../validations/product.validation';
import { isAuthorized } from '../middleware/user.authenticate';
import { UserRole } from '../models/user.model';

const productRoutes = express.Router();

productRoutes.post(
  '/product/create',
  validateSchema(productSchema.product),
  isAuthenticated,
  isAuthorized(UserRole.VENDOR),
  productsController.createProduct,
);
productRoutes.patch(
  '/product/:productId',
  validateSchema(productSchema.update),
  isAuthenticated,
  isAuthorized(UserRole.VENDOR),
  productsController.updateProduct,
);

export default productRoutes;
