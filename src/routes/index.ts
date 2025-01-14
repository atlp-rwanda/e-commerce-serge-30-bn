import express, { Router } from 'express';
import http from 'http'; 
import roleRoute from './role.route';
import userRoute from './user.route';
import authRoute from './auth.route';
import googleAuthRoute from './passport.routes';
import { profileRouter } from './profile.route';
import categoryRoutes from './products.category.routes';
import productRoutes from './products.routes';
import vendorRoutes from './vendor.routes';
import wishListRoute from './whishlist.route';
import cartRoute from './cart.route';
import searchRoutes from './productSearch.router';
import adminRoute from './admin.routes';
import paymentRoute from './payment.route';
import orderRoute from './order.route';
import reviewRoutes from './review.routes';
import notificationRoute from './notification.route';

import chatRoute from './chat.route';
import injectWebSocketService from '../middleware/injectWebSocket'; 
import { WebSocketService } from '../utils/orderStatusWebsocket'; 


const app = express();


const server = http.createServer(app);


const webSocketService = new WebSocketService(server);


const router = Router();
const routers: Router[] = [
  notificationRoute,
  paymentRoute,
  wishListRoute,
  roleRoute,
  userRoute,
  authRoute,
  profileRouter,
  googleAuthRoute,
  categoryRoutes,
  productRoutes,
  vendorRoutes,
  cartRoute,
  searchRoutes,
  orderRoute,
  adminRoute,
  chatRoute,
  adminRoute,
  reviewRoutes,
];

router.use(injectWebSocketService(webSocketService));

router.use('/api/v1', routers);

export default router;


