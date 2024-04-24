import { Router } from 'express';
import { forgotPassword, resetPassword, updatePassword } from '../controllers';
import { AuthSchema, validateSchema } from '../validations/auth.validation';
import { Login } from '../controllers/auth.controller';
const authRoute = Router();

authRoute.post(
  '/forgot-password',
  validateSchema(AuthSchema.forgotPassword),
  forgotPassword,
);
authRoute.post(
  '/reset-password',
  validateSchema(AuthSchema.resetPassword),
  resetPassword,
);

authRoute.put(
  '/:userId/update-password',
  validateSchema(AuthSchema.updatePassword),
  updatePassword,
);

authRoute.post('/login', validateSchema(AuthSchema.login), Login);
export { authRoute };
