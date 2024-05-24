import { Router } from 'express';
import { updateProfile, getProfile } from '../controllers';
import { profileSchema, validateSchema } from '../middleware/validators';
import { isAuthenticated } from '../middleware/authentication/auth.middleware';

const profileRouter = Router();

profileRouter.get('/profile/:id', isAuthenticated, getProfile,);
profileRouter.put( '/profile/:id',validateSchema(profileSchema), isAuthenticated, updateProfile);


 
export { profileRouter };
