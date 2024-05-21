import { Router } from 'express';
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

const router = Router();
const routers: Router[] = [
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
  adminRoute
]


router.use('/api/v1', routers);
export default router;
