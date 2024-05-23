import express from 'express';
import { getAllOrders, getOrderStatus} from '../controllers/order.controller';
import { isAuthenticated } from '../middleware/authentication/auth.middleware';
import { validateSchema } from '../middleware/validators';
import { orderSchema } from '../validations/order.validation';
import { isAuthorized } from '../middleware/user.authenticate';
import { UserRole } from '../models/user.model';
import { updateOrderStatusValidation } from '../validations/orderStatus.validation';
import createOrder from "../controllers/order.controller";
import { updateOrderStatusHandler } from '../utils/updateOrderStatusHandler';

const router = express.Router();

router.post(
  '/checkout',
  isAuthenticated,
  validateSchema(orderSchema.order),
  isAuthorized(UserRole.USER),
  createOrder
);

router.get('/orders/:orderId/status', isAuthenticated, getOrderStatus);
router.get('/orders/all', isAuthenticated, getAllOrders);

router.post(
  '/orders/:orderId/status',
  isAuthenticated,
  updateOrderStatusValidation,
  updateOrderStatusHandler
);

export default router;