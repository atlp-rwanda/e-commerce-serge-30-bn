import { Router } from 'express';
import { googleAuth } from '../controllers/google.controller';

const googleAuthRoute = Router();

googleAuthRoute.get('/auth/google/callback', googleAuth);

export default googleAuthRoute;
