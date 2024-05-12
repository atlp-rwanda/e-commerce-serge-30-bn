import express from 'express';
import {
  registerUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  emailVerification,
  resendVerificationToken
} from '../controllers/user.controller';
import { validateSchema, UserSchema } from '../validations/user.validation'


const userRoute = express.Router();

  userRoute.post('/create', validateSchema(UserSchema.signUp), registerUser);
  userRoute.get('/email-verification/:userToken', emailVerification);
  userRoute.post('/resend-verification-token', resendVerificationToken);
  userRoute.get('/users', getAllUsers);
  userRoute.get('/:id', getUserById);
  userRoute.get('/:id',updateUser);
  userRoute.delete('/:id', deleteUser)

export default userRoute;



