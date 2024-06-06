import Notification from '../models/notifications.model';

class NotificationService {
  async getNotificationsByUserId(userId: string) {
    return await Notification.findAll({
      where: { userId: userId },
    });
  }
}

export default new NotificationService();
