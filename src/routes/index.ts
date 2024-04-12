
import express from 'express';
import { UserController } from '../controllers/index';

const router = express.Router();


export default (): express.Router => {
    router.post('/create', UserController.createUser);
    router.get('/users', UserController.getAllUsers);
    router.get('/:id', UserController.getUserById);
    router.patch('/:id', UserController.updateUser);
    router.delete('/:id', UserController.deleteUser);
  
  return router;
};
