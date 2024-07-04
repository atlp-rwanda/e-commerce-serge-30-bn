import express from 'express';
import {
  deleteItem,
  productsController,
} from '../controllers/products.controller';
import { isAuthenticated } from '../middleware/authentication/auth.middleware';
import { isAuthorized } from '../middleware/user.authenticate';
import { UserRole } from '../models/user.model';
import { productSchema } from '../validations/product.validation';
import { validateSchema } from '../utils/joi.validateSchema';

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
productRoutes.delete(
  '/product/:id',
  isAuthenticated,
  isAuthorized(UserRole.VENDOR),
  deleteItem,
);

productRoutes.get(
  '/product/:product_id',
  isAuthenticated,
  productsController.getProductById,
);
productRoutes.get(
  '/products/all',
  isAuthenticated,
  productsController.getAllProducts,
);
productRoutes.get('/products/list', productsController.getAllProductsAvailable);
productRoutes.get(
  '/products/all/expired',
  isAuthorized(UserRole.VENDOR),
  isAuthenticated,
  productsController.getAllExpiredProducts,
);

productRoutes.put(
  '/product/available/:id',
  validateSchema(productSchema.statusChange),
  isAuthorized(UserRole.VENDOR),
  isAuthenticated,
  productsController.changeStatus,
);

export default productRoutes;
