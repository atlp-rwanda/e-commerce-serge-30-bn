import { Router } from 'express';
import roleRoute from './role.route';
import userRoute from './user.route';
import authRoute from './auth.route';
import googleAuthRoute from './passport.routes';
import { profileRouter } from './profile.route';

const router = Router();
const routers: Router[] = [
  roleRoute,
  userRoute,
  authRoute,
  profileRouter,
  googleAuthRoute,
];

router.use('/api/v1', routers);

export default router;
