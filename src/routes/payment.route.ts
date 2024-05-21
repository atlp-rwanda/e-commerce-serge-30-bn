import { Router } from 'express';
import {
  makepaymentsession,
  paymentSuccess,
  paymentCancel,
} from '../controllers/payment.controller';
import { isAuthenticated } from '../middleware/authentication/auth.middleware';
import { isAuthorized } from '../middleware/user.authenticate';
import { UserRole } from '../models/user.model';
const paymentRoute = Router();

paymentRoute.post(
  '/payment',
  isAuthenticated,
  isAuthorized(UserRole.USER),
  makepaymentsession,
);
paymentRoute.get('/payment/success', isAuthenticated, paymentSuccess);
paymentRoute.get('/payment/cancel', isAuthenticated, paymentCancel);

export default paymentRoute;
