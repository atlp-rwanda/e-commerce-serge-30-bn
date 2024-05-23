import express from "express";
import { getNotifications } from "../controllers/notification.controller";
import { isAuthenticated } from "../middleware/authentication/auth.middleware";

const notificationRoute = express.Router();

notificationRoute.get('/notifications/all', isAuthenticated,getNotifications);


export default notificationRoute;