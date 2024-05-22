import express from 'express';
import { isAuthenticated } from '../middleware/authentication/auth.middleware';
import { cartController } from '../controllers/cart.controller';
import { validateSchema } from '../utils/joi.validateSchema';
import { cartSchema } from '../validations/cart.validation';

const cartRoute = express.Router();

cartRoute.post(
  '/cart/addtocart',
  isAuthenticated,
  validateSchema(cartSchema.addItem),
  cartController.addItemToCart,
);
cartRoute.patch(
  '/cart/updatecart/:cartId',
  isAuthenticated,
  validateSchema(cartSchema.updateItem),
  cartController.updateItemInCart,
);
cartRoute.get(
  '/cart/viewcart',
  isAuthenticated,
  cartController.viewCart
);

export default cartRoute;
