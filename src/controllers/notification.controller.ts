import { Response } from 'express';
import NotificationService from '../service/notification.service';
import { RequestUser } from '../middleware/user.authenticate';

const getNotifications = async (req: RequestUser, res: Response) => {
  try {
    if (!req.user) {
      return;
    }
    const userId = req.user.user_id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const notifications =
      await NotificationService.getNotificationsByUserId(userId);
    return res
      .status(200)
      .json({ message: 'all notifications', notifications: notifications });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const markNotificationAsRead = async (req: RequestUser, res: Response) => {
  try {
    const { notificationId } = req.params;
    if (!notificationId) {
      return res.status(400).json({ message: 'Notification ID is required' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = req.user.user_id;

    const notification = await NotificationService.getNotificationByIdAndUserId(
      notificationId,
      userId,
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.isRead) {
      return res.status(200).json({ message: 'Notification is already read' });
    }

    await NotificationService.markNotificationAsRead(notificationId, userId);
    return res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
const markAllNotificationsAsRead = async (req: RequestUser, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = req.user.user_id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const message =
      await NotificationService.markAllNotificationsAsRead(userId);
    return res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { getNotifications, markNotificationAsRead, markAllNotificationsAsRead };
