import express from 'express';
import { productsController } from '../controllers/products.controller';
import { isAuthenticated } from '../middleware/authentication/auth.middleware';
import { isAuthorized } from '../middleware/user.authenticate';
import { UserRole } from '../models/user.model';
import {
  validateSchema,
  productSchema,
} from '../validations/product.validation';


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

productRoutes.get('/product/:product_id',
isAuthenticated,
productsController.getProductById)
productRoutes.get('/products/all',isAuthenticated,productsController.getAllProducts);

export default productRoutes;
