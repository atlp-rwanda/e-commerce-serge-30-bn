import { Router } from 'express';
import { updateProfile, getProfile } from '../controllers';
import { profileSchema, validateSchema } from '../middleware/validators';
import { isAuthenticated } from '../middleware/authentication/auth.middleware';

const profileRouter = Router();

profileRouter.get('/users/profile', isAuthenticated, getProfile,);
profileRouter.put( '/users/profile',validateSchema(profileSchema), isAuthenticated, updateProfile);


 
export { profileRouter };
