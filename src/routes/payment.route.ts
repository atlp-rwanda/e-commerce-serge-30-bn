import { Router } from 'express';
import {
  makepaymentsession,
  paymentSuccess,
  paymentCancel,
  getAllPayments,
} from '../controllers/payment.controller';
import { isAuthenticated } from '../middleware/authentication/auth.middleware';
import { isAuthorized } from '../middleware/user.authenticate';
import { UserRole } from '../models/user.model';
import { initiateMoMoPayment } from '../controllers/momo.controller';
import { validateSchema } from '../middleware/validators';
import { PaymentSchema } from '../validations/payment.validation';
const paymentRoute = Router();

paymentRoute.post(
  '/payment',
  isAuthenticated,
  isAuthorized(UserRole.USER),
  makepaymentsession,
);
paymentRoute.post(
  '/payment/momo',
  isAuthenticated,
  validateSchema(PaymentSchema.momo),
  initiateMoMoPayment,
);
paymentRoute.get('/payment/success', isAuthenticated, paymentSuccess);
paymentRoute.get('/payment/cancel', isAuthenticated, paymentCancel);
paymentRoute.get('/payment/all', isAuthenticated, getAllPayments);

export default paymentRoute;