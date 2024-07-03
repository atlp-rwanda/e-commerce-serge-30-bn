import { Request, Response } from 'express';
import { User } from '../models';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { getGoogleOAuthToken, getGoogleUser } from '../service/google.service';
import { sendEmail } from '../helpers/sendEmail';
import { ordinaryEmailTemplate } from '../helpers/EmailTemplates/ordinaryEmailTemplate';

const fromEmail = process.env.FROM_EMAIL;

export async function googleAuth(req: Request, res: Response) {
  const code = req.query.code as string;

  try {
    const { id_token, access_token } = await getGoogleOAuthToken({ code });
    console.log({ id_token, access_token });

    const { email, name, picture, given_name, family_name } =
      await getGoogleUser({ id_token, access_token });

    let googleUser = await User.findOne({ where: { email } });

    console.log({ googleUser });

    if (!googleUser) {
      try {
        const randomPassword = crypto.randomBytes(16).toString('hex');
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        googleUser = await User.create({
          username: name,
          email,
          password: hashedPassword,
          firstname: given_name,
          lastname: family_name,
          role: 'USER',
          verified: true,
          image_url: picture,
        });

        const message = `Dear ${googleUser.firstname},<br><br><br><br>You have successfully registered to the Exclusive E-commerce platform. You are now allowed to use our Services.<br><br><br>Best,<br><br>Exclusive Team`;
        if (fromEmail) {
          const emailOptions = {
            to: googleUser.email,
            from: fromEmail,
            subject: 'Registration Successful',
            template: () => ordinaryEmailTemplate(message),
          };
          await sendEmail(emailOptions);
        } else {
          console.error('fromEmail environment variable is not set.');
        }
      } catch (error) {
        console.error('Error creating user:', error);
        return res.redirect(process.env.ERROR_REDIRECT_URL as string);
      }
    }

    const googleUserString = JSON.stringify(googleUser);

    const encodedGoogleUser = encodeURIComponent(googleUserString);

    const JWT_SECRET = process.env.JWT_SECRET as string;
    const token = jwt.sign({ googleUser }, JWT_SECRET, {
      expiresIn: '1h',
    });
    const SUCCESS_REDIRECT_URL = process.env.SUCCESS_REDIRECT_URL as string;
    let redirectURL = SUCCESS_REDIRECT_URL;
    if (googleUser.role === 'VENDOR') {
      redirectURL += '/vendor';
    } else if (googleUser.role === 'ADMIN') {
      redirectURL += '/admin';
    }

    res
      .header('Authorization', token)
      .cookie('Authorization', token, {
        httpOnly: true,
        maxAge: 60 * 600 * 1000,
        sameSite: 'none',
        secure: true,
      })
      .redirect(`${redirectURL}/?token=${token}&user=${encodedGoogleUser}`);
  } catch (error) {
    return res.redirect(process.env.ERROR_REDIRECT_URL as string);
  }
}
