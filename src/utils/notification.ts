import { Server as SocketIOServer, Namespace } from 'socket.io';
import { Server as HttpServer } from 'http';
import { notificationEmailTemplate } from '../helpers/EmailTemplates/notificationEmailTemplate';
import { sendEmail } from '../helpers/sendEmail';
import notificationService from '../service/notification.service';

let io: SocketIOServer;
let Notification: Namespace;
const fromEmail = process.env.FROM_EMAIL || 'martinemahirwe@gmail.com';

export const socketserverstart = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
    },
  });
  Notification = io.of('/notification');
  Notification.on('connection', (socket) => {
    console.log('connected socket io');
    socket.on('joinRoom', (userId: string) => {
      socket.join(userId);
    });
    socket.on('fetchNotifications', async (userId: string) => {
      try {
        const notifications =
          await notificationService.getNotificationsByUserId(userId);
        socket.emit('notifications', notifications);
        //triggerNotification(userId, notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        socket.emit('error', { message: 'Error fetching notifications' });
      }
    });
  });
};

export const SocketTrigger = (
  userid: string,
  email: string,
  message: string,
  subject: string,
) => {
  console.log(userid, 'user loged in');
  Notification.to(userid).emit('productStatusChange', {
    email,
    message,
    subject,
  });
};
export const triggerNotification = (userid: string) => {
  console.log(`Triggering fetchNotifications for user ${userid}`);
  Notification.to(userid).emit('fetchNotifications', userid);
};

export async function sendNotification(
  email: string,
  message: string,
  subject: string,
) {
  const mailOptions = {
    to: email,
    from: fromEmail,
    subject: 'Product Status Change Notification',
    template: () => notificationEmailTemplate(subject, message),
    isVerificationEmail: false,
  };
  await sendEmail(mailOptions);
  return true;
}
export { io, Notification };
