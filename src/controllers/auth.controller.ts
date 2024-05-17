import { Request, Response } from 'express';
import AuthService from '../service/auth.service';
import bcrypt from 'bcrypt';

import { validate } from '../middleware/validators/schemaValidators';
import { generateToken } from '../utils/jwt.utils';
import { UserService } from '../service/user.service';
import { VerifyTokenService } from '../service/VerifyToken.service';
import { sendEmail } from '../helpers/sendEmail';
import { twoFactorAuthEmailTemplate } from '../helpers/EmailTemplates/twoFactorAuthEmailTemplate';
export interface TokenDataProp {
  email?: string;
  name?: string;
  code?: string;
}
interface EmailOptions {
  to: string | string[];
  from: string;
  subject: string;
  template: (data: TokenDataProp) => string;
  isVerificationEmail?: boolean;
  verificationUrl?: string;
}
const fromEmail = process.env.FROM_EMAIL;
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const message = await AuthService.forgotPassword(email);

    return res.status(200).json({ message });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    const message = await AuthService.resetPassword(token, password);

    return res.status(200).json({ message });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }
  }
};

export const LogoutUsers = async (req: Request, res: Response) => {
  try {
    res.clearCookie('Authorization');
    return res.status(200).send('Logout Successfully');
  } catch (error) {
    console.error('Logout error ', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};
export const updatePassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    // Check if the provided old password matches the one stored in the database
    const passwordMatch = await AuthService.verifyPassword(id, oldPassword);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid old password' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).json({ message: 'Password must match' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await AuthService.updatePassword(id, hashedPassword);

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const Login = async (req: Request, res: Response) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;

  const user = await AuthService.getUserByEmail(email);

  if (!user) {
    return res.status(404).json({ message: "User doesn't exist" });
  }

  if (!user.verified) {
    return res.status(401).json({ message: 'User is not verified' });
  }
  if (!user.active) {
    return res.status(401).json({ message: 'This account has been deactivated ' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const passwordRemoved = { ...user.toJSON(), password: undefined };
  const token = generateToken({ user: passwordRemoved });
  return res
    .header('Authorization', token)
    .cookie('Authorization', token, {
      httpOnly: true,
      maxAge: 60 * 600 * 1000,
    })
    .status(200)
    .json({ message: `${user.username} successfully logged in`, token });
};
export const sendEmailVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(email);
    const user = await UserService.findUserBy(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let name;
    if (user) {
      name = user.dataValues.username;
    }
    const code = token;
    const TokenData: TokenDataProp = {
      email,
      name,
      code,
    };
    if (fromEmail) {
      const emailOptions: EmailOptions = {
        to: email,
        from: fromEmail,
        subject: 'Verification Code',
        template: () => twoFactorAuthEmailTemplate(TokenData),
      };
      const response = await sendEmail(emailOptions);
      console.log("response" , response)
    }
    const expirationDurationMs = 60 * 60 * 1000;
    const currentTime = new Date();
    const expirationTime = new Date(
      currentTime.getTime() + expirationDurationMs,
    );
    expirationTime.setUTCHours(expirationTime.getUTCHours() + 2);

    if (user) {
      const tokenData = {
        email,
        token,
        expirationTime,
        user_id: user.dataValues.user_id,
      };
      await VerifyTokenService.createToken(tokenData);
      console.log(user.dataValues.user_id);
    }

    res.status(200).json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyAuthenticationCode = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    const userEmail = await UserService.findUserBy(email);

    if (!userEmail) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = await VerifyTokenService.findEmailAndToken(email, code);
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }
    const expirationTime = new Date(token.dataValues.expirationTime);
    const currentTimePlusOneHour = new Date(Date.now() + 60 * 60 * 1000);
    const isTokenExpired =
      expirationTime.getTime() < currentTimePlusOneHour.getTime();

    if (isTokenExpired || token.dataValues.used) {
      return res.status(400).json({ message: 'Token has expired' });
    }

    console.log('Token is', token.dataValues.token, 'Code is', code);
    const tokenValue = token.dataValues.token.toString();

    const isCodeValid = tokenValue === code;
    if (isCodeValid) {
      res
        .status(200)
        .json({ message: 'Authentication code verified successfully' });
      await token.update({ used: true });
    } else {
      res.status(400).json({ message: 'Invalid authentication code' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
