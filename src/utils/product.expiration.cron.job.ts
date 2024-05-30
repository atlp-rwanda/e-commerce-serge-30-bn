import cron from 'node-cron';
import Vendor from '../models/vendor.model';
import Product from '../models/products.Model';
import User from '../models/user.model';
import { Op } from 'sequelize';
import { sendEmail } from '../helpers/sendEmail';
import { ordinaryEmailTemplate } from '../helpers/EmailTemplates/ordinaryEmailTemplate';

const fromEmail = process.env.FROM_EMAIL;

export const checkAndMarkExpiredProducts = async (): Promise<Product[]> => {
  const currentDate = new Date();
  const expiredProducts = await Product.findAll({
    where: {
      expiry_date: {
        [Op.lt]: currentDate,
      },
      expired: false,
    },
  });

  for (const product of expiredProducts) {
    product.expired = true;
    product.available = false;
    await product.save();

    const vendor = await Vendor.findOne({
      where: { vendor_id: product.vendor_id },
    });

    if (vendor) {
      const user = await User.findOne({ where: { user_id: vendor.user_id } });

      if (user) {
        const message = `Dear ${user.firstname},<br><br><br><br>Your product called ${product.name} has expired on ${product.expiry_date.toDateString()}.<br><br><br>Best,<br><br>Your Team`;
        if (fromEmail) {
          const emailOptions = {
            to: user.email,
            from: fromEmail,
            subject: 'Product Expiration Notification',
            template: () => ordinaryEmailTemplate(message),
          };
          await sendEmail(emailOptions);
        } else {
          console.error('FROM_EMAIL environment variable is not set.');
        }
      }
    } else {
      console.log('No vendor found');
    }
  }
  return expiredProducts;
};

if (process.env.NODE_ENV === 'production') {
  cron.schedule(
    '0 0 * * *',
    async () => {
      console.log('Running a job at 00:00 at Africa/Kigali timezone');
      await checkAndMarkExpiredProducts();
    },
    {
      scheduled: true,
      timezone: 'Africa/Kigali',
    },
  );
}
