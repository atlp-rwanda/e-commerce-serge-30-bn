import { Router } from 'express';
import { Login, forgotPassword, resetPassword, updatePassword } from '../controllers';
import { AuthSchema, validateSchema } from '../validations/auth.validation';
const authRoute = Router();


  authRoute.post(
    '/auth/forgot-password',
    validateSchema(AuthSchema.forgotPassword),
    forgotPassword,
  );
  authRoute.post(
    '/auth/reset-password',
    validateSchema(AuthSchema.resetPassword),
    resetPassword,
  );


  
  authRoute.put(
    '/auth/:userId/update-password',
    validateSchema(AuthSchema.updatePassword),
    updatePassword,
  );
  
  authRoute.post('/auth/login', validateSchema(AuthSchema.login), Login);

export default authRoute;



