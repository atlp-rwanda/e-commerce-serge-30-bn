import { Router } from 'express';
import { updateProfile, getProfile } from '../controllers';
import { profileSchema, validateSchema } from '../middleware/validators';
import { profileAuth } from '../utils/profile.auth';

const profileRouter = Router();

profileRouter.get('/profile/:id',profileAuth, getProfile,);
profileRouter.put( '/profile/:id',validateSchema(profileSchema),profileAuth, updateProfile);


 
export { profileRouter };
