import Notification from '../models/notifications.model';

class NotificationService {
  async getNotificationsByUserId(userId: string) {
    return await Notification.findAll({
      where: { userId: userId },
    });
  }

  async getNotificationByIdAndUserId(notificationId: string, userId: string) {
    return await Notification.findOne({
      where: { id: notificationId, userId: userId },
    });
  }

  async markNotificationAsRead(notificationId: string, userId: string) {
    const notification = await Notification.findOne({
      where: { id: notificationId, userId: userId },
    });

    if (!notification) {
      throw new Error('Notification not found or unauthorized');
    }

    notification.isRead = true;
    await notification.save();
    return notification;
  }

  async markAllNotificationsAsRead(userId: string) {
    const unreadNotifications = await Notification.findAll({
      where: { userId, isRead: false },
    });

    if (unreadNotifications.length === 0) {
      return 'All notifications are already read';
    }

    await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } },
    );

    return 'Notifications marked as read';
  }
}

export default new NotificationService();
