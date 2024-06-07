import express from 'express';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../controllers/notification.controller';
import { isAuthenticated } from '../middleware/authentication/auth.middleware';

const notificationRoute = express.Router();

notificationRoute.patch(
  '/notifications/all/read',
  isAuthenticated,
  markAllNotificationsAsRead,
);
notificationRoute.patch(
  '/notifications/:notificationId/read',
  isAuthenticated,
  markNotificationAsRead,
);

notificationRoute.get('/notifications/all', isAuthenticated, getNotifications);

export default notificationRoute;
