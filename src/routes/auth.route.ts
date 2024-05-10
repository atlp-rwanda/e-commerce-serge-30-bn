import { Router } from 'express';
import { Login, LogoutUsers, forgotPassword, resetPassword, sendEmailVerification, updatePassword, verifyAuthenticationCode } from '../controllers';
import {
  AuthSchema,
  validateSchema,
  EmailSchema,
  EmailTokenSchema,
} from '../validations/auth.validation';
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
  
 authRoute.post(
   '/auth/send-verification-email',
   validateSchema(EmailSchema.email),
   sendEmailVerification,
 );
 authRoute.get('/auth/logout', LogoutUsers);
 authRoute.post('/auth/verify-authentication-code', validateSchema(EmailTokenSchema.emailToken),verifyAuthenticationCode); 

export default authRoute;



