import { EventEmitter } from 'events';
import cron from 'node-cron';
import User from '../models/user.model';
import { Op } from 'sequelize';
import { sendEmail } from '../helpers/sendEmail';
import { ordinaryEmailTemplate } from '../helpers/EmailTemplates/ordinaryEmailTemplate';

const fromEmail = process.env.FROM_EMAIL;
const eventEmitter = new EventEmitter();
const PASSWORD_EXPIRATION_DAYS = parseInt(
  process.env.PASSWORD_EXPIRATION_DAYS || '60',
  10
);

eventEmitter.on('usersFoundWithExpiredPasswords', (users) => {
  console.log(`Users with expired passwords found: ${users.length}`);
});

eventEmitter.on('passwordExpirationCheckCompleted', (userCount) => {
  console.log(`Password expiration check completed for ${userCount} users`);
});

export const checkPasswordExpiration = async () => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() - PASSWORD_EXPIRATION_DAYS);

  try {
    const users = await User.findAll({
      where: {
        [Op.and]: [
          { lastTimePasswordUpdate: { [Op.lt]: expirationDate } },
          { passwordExpired: false },
        ],
      },
    });

    if (users.length > 0) {
      eventEmitter.emit('usersFoundWithExpiredPasswords', users);
    }

    for (const user of users) {
      await user.update({ passwordExpired: true });

      const message = `Dear ${user.username},\n\nYour password has expired as of ${new Date().toDateString()}.\nTo log in next time you will be required to update your password.\n`;

      if (fromEmail) {
        const emailOptions = {
          to: user.email,
          from: fromEmail,
          subject: 'Password Expiration Notification',
          template: () =>
            ordinaryEmailTemplate(
              message
            ),
        };
        await sendEmail(emailOptions);
      } else {
        console.error('FROM_EMAIL environment variable is not set.');
      }

    }

    eventEmitter.emit('passwordExpirationCheckCompleted', users.length);
  } catch (error) {
    console.error('Error checking password expiration:', error);
  }
};

const startCronJob = () => {
  if (process.env.NODE_ENV === 'development') {
    cron.schedule(
      '0 0 * * *',
      async () => {
        console.log('Running password expiry cron job at 00:00 at Africa/Kigali timezone');
        await checkPasswordExpiration();
      },
      {
        scheduled: true,
        timezone: 'Africa/Kigali',
      }
    );
  }
};

export default startCronJob;