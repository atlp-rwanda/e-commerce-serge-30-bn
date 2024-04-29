import express from 'express';
import {
  registerUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from '../controllers/user.controller';
import { validateSchema, UserSchema } from '../validations/user.validation'

const router = express.Router();

export default (): express.Router => {
  router.post('/create', validateSchema(UserSchema.signUp), registerUser);
  router.get('/users', getAllUsers);
  router.get('/:id', getUserById);
  router.patch('/:id', updateUser);
  router.delete('/:id', deleteUser);

  return router;
};