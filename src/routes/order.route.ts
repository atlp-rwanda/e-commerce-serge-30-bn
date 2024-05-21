import express from "express";
import createOrder from '../controllers/order.controller';
import { isAuthenticated } from "../middleware/authentication/auth.middleware";
import { validateSchema } from "../middleware/validators";
import { orderSchema } from "../validations/order.validation";
import { isAuthorized } from '../middleware/user.authenticate';
import { UserRole } from '../models/user.model';
const orderRoute = express.Router();


orderRoute.post('/checkout', isAuthenticated,validateSchema(orderSchema.order),isAuthorized(UserRole.USER), createOrder);


export default orderRoute;