import express from 'express';
import { disableUserAccount } from '../controllers';
import {
  isAdmin,
  isAuthenticated,
} from '../middleware/authentication/auth.middleware';
const adminRoute = express.Router();

adminRoute.post(
  '/admin/disable/:user_id',
  isAuthenticated,
  isAdmin,
  disableUserAccount,
);
export default adminRoute;
