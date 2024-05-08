import express from 'express';
import { isAuthorized } from '../middleware/user.authenticate';
import {UserRole}  from '../models/user.model';
import { roleController } from '../controllers/role.controller';


const roleRoute = express.Router();


  roleRoute.patch('/role/:id', isAuthorized(UserRole.ADMIN),roleController.updateUserRole);

  export  default roleRoute;



