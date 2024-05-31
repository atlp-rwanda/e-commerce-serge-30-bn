import express from 'express';
import { disableUserAccount, getAllUsersWithExpiredPasswords } from '../controllers';
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
adminRoute.get(
  '/admin/expired-password-users',
  isAuthenticated,
  isAdmin,
  getAllUsersWithExpiredPasswords,
);

export default adminRoute;
