import { config } from 'dotenv';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import { logger } from '../config/Logger';

config();

interface IData {
  email: string;
  name: string;
  code: string;
}

const { EMAIL, PASSWORD } = process.env;

export const sendEmail = async (type: string, data: IData) => {
  try {
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Ecommerce-team',
        link: 'https://mailgen.js/',
      },
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    });

    const mailOptions = {
      from: EMAIL,
      to: data.email,
      subject: 'Two-Factor Authentication Code',
      html: '',
    };

    const email = {
      body: {
        name: data.name,
        intro:
          'Your verification code for Two-factor authentication:' + data.code,
        code: data.code,
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    mailOptions.html = mailGenerator.generate(email);

    const info = await transporter.sendMail(mailOptions);
    logger.info(info);

    console.log(data.code);
  } catch (error) {
    if (error instanceof Error) logger.error(error.message);
  }
};
