import bcrypt from 'bcrypt';
import User from '../models/user.model';
import crypto from 'crypto';
import { Op } from 'sequelize';
import {sendEmail} from '../helpers/sendEmail';
import { verificationEmailTemplate } from '../helpers/EmailTemplates/emailVerificationTemplate';
import verifytokens from '../models/verifytokens.model';
import AuthService from './auth.service';

interface UserData {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  verified: boolean;
}

interface EmailOptions {
  to: string | string[];
  from: string;
  subject: string;
  template: (data: UserData) => string;
  attachmentPath?: string;
  isVerificationEmail?: boolean;
  verificationUrl?: string;
}

const fromEmail = process.env.FROM_EMAIL;

export class UserService {
  static async createUser(userData: UserData): Promise<User> {
    try {
      const existingUserWithEmail = await User.findOne({
        where: { email: userData.email },
      });

      if (existingUserWithEmail) {
        throw new Error('Email already exists');
      }

      const existingUserWithUserName = await User.findOne({
        where: { username: userData.username },
      });
      if (existingUserWithUserName) {
        throw new Error('Username already exists');
      }

      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationTokenExpiration = new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString();

      const hashedPassword = bcrypt.hashSync(userData.password, 10);

      // Create a new user
      const newUserCreated = await User.create({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        firstname: userData.firstname,
        lastname: userData.lastname,
        emailVerificationToken: emailVerificationToken,
        emailVerificationTokenExpiration: emailVerificationTokenExpiration,
        previousPasswords: JSON.stringify([hashedPassword]),
      });

      // Omit password field from the returned User object
      const newUser = { ...newUserCreated.toJSON() };
      delete newUser.password;

      const emailVerificationUrl = `${process.env.DEPLOYED_URL}/api/v1/email-verification/${emailVerificationToken}`;

      if (fromEmail) {
        const emailOptions: EmailOptions = {
          to: userData.email,
          from: fromEmail,
          subject: 'Verify Email',
          isVerificationEmail: true,
          template: () => verificationEmailTemplate(emailVerificationUrl),
          verificationUrl: emailVerificationUrl,
        };
        await sendEmail(emailOptions);
      } else {
        console.error('FROM_EMAIL environment variable is not set.');
      }

      return newUser;
    } catch (error) {
      throw new Error('Could not create user: ' + error);
    }
  }

  static async findUserBy(Option: string): Promise<User | null> {
    try {
      const existingUserWithEmail = await User.findOne({
        where: { email: Option },
      });

      return existingUserWithEmail;
    } catch (error) {
      throw new Error('Could not Find user: ' + error);
    }
  }

  public static async findEmailAndToken(
    email: string,
    token: string,
  ): Promise<verifytokens | null> {
    try {
      const UserWithEmailAndToken = await verifytokens.findOne({
        where: { email: email, token: token },
      });

      return UserWithEmailAndToken;
    } catch (error) {
      throw new Error('Could not Find user: ' + error);
    }
  }

  public static async emailVerification(token: string) {
    if (!token) {
      throw new Error('Token is missing');
    }

    const user = await User.findOne({
      where: {
        emailVerificationToken: token,
        emailVerificationTokenExpiration: {
          [Op.gt]: Date.now(), // Check for expiration time greater than current time
        },
      },
    });

    if (!user) {
      throw new Error('Invalid or expired token');
    }

    user.verified = true;
    await user.save();

    return 'Email verified successfully';
  }

  public static async resendVerificationToken(email: string) {
    if (!email) {
      throw new Error('Email is missing');
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.verified) {
      throw new Error('Your account is already verified');
    }

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationTokenExpiration = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ).toISOString();

    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationTokenExpiration = emailVerificationTokenExpiration;
    await user.save();

    const emailVerificationUrl = `${process.env.DEPLOYED_URL}/api/v1/email-verification/${emailVerificationToken}`;

    if (fromEmail) {
      const emailOptions: EmailOptions = {
        to: user.email,
        from: fromEmail,
        subject: 'Verify Email',
        template: () => verificationEmailTemplate(emailVerificationUrl),
      };
      await sendEmail(emailOptions);
    } else {
      console.error('FROM_EMAIL environment variable is not set.');
    }

    return 'An email verification link has been sent to your email';
  }

  public static async getUserById(user_id: string): Promise<User> {
    try {
      const user = await User.findOne({ where: { user_id } });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }
  static async disableUser(userId: string): Promise<UserData | string> {
    const user = await AuthService.querySingleUser({
      where: { user_id: userId },
    });

    if (!user) {
      throw new Error("User doesn't exist");
    }

    if (user.active === false) {
      return 'User is already not active';
    }

    user.active = false;
    await user.save();

    const usersData: UserData = {
      username: user.username,
      verified: user.verified,
      email: user.email,
      password: '',
      firstname: '',
      lastname: ''
    };

    return usersData;
  }
}
