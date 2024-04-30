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


const router = Router();
const routers: Router[] = [
  wishListRoute,
  roleRoute,
  userRoute,
  authRoute,
  profileRouter,
  googleAuthRoute,
  categoryRoutes,
  productRoutes,
  vendorRoutes,
]
router.use('/api/v1', routers);
export default router;
