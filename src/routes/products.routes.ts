import express from 'express';
import { productsController } from '../controllers/products.controller';
import { isAuthenticated } from '../middleware/authentication/auth.middleware';
import {
  validateSchema,
  productSchema,
} from '../validations/product.validation';

const productRoutes = express.Router();

productRoutes.post(
  '/product/create',
  validateSchema(productSchema.product),
  isAuthenticated,
  productsController.createProduct,
);

export default productRoutes;
