import { Response } from 'express';
import NotificationService from '../service/notification.service';
import { RequestUser } from '../middleware/user.authenticate';

const getNotifications = async (req: RequestUser, res: Response) => {
  try {
    if(!req.user){
      return;
    }
    const userId = req.user.user_id;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const notifications = await NotificationService.getNotificationsByUserId(userId);
    return res
      .status(200)
      .json({ message: "all notifications", notifications: notifications });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error" });
  }
};

export { getNotifications };
