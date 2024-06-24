import  User  from '../models/user.model';
import {sendEmail} from '../helpers/sendEmail';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { resetPasswordTemplate } from '../helpers/EmailTemplates/resetPasswordTemplate';


interface UserData {
  email: string;
  user_id: string;
}

class AuthService {
  public static async querySingleUser(options: {
    where: Partial<UserData>;
  }): Promise<User> {
    const user = await User.findOne({ where: options.where });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  public static async forgotPassword(email: string) {
    const user = await AuthService.querySingleUser({ where: { email } });
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ).toISOString();

    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    // Create reset password link
    const resetUrl = `${process.env.DEPLOYED_URL_FN}/auth/reset-password/${resetToken}`;

    // Generate email content (HTML format recommended for better formatting)

    interface EmailOptions {
      to: string | string[];
      from: string;
      subject: string;
      template: (data: UserData) => string;
      attachmentPath?: string;
      isVerificationEmail?: boolean;
    }

    const fromEmail = process.env.FROM_EMAIL;

    if (fromEmail) {
      const emailOptions: EmailOptions = {
        to: user.email,
        from: fromEmail,
        subject: 'Reset password',
        template: () => resetPasswordTemplate(resetUrl),
      };
      await sendEmail(emailOptions);
    } else {
      console.error('FROM_EMAIL environment variable is not set.');
    }

    return 'A password reset link has been sent to your email';
  }

  public static async resetPassword(token: string, password: string) {
    if (!password || !token) {
      throw new Error('Password and token are required');
    }

    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: {
          [Op.gt]: Date.now(), // Check for expiration time greater than current time
        },
      },
    });

    if (!user) {
      throw new Error('Invalid or expired token');
    }

    // Hash the new password before saving
    const hashedPassword = bcrypt.hashSync(password, 10);

    user.password = hashedPassword;
    user.resetToken = null; // Clear reset token after successful password change
    user.resetTokenExpiration = null;
    await user.save();

    return 'Password reset successful';
  }

  public static async verifyPassword(
    userId: string,
    oldPassword: string,
  ): Promise<boolean> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return bcrypt.compare(oldPassword, user.password);
  }

  public static async updatePassword(
    userId: string,
    newPassword: string,
  ): Promise<void> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update({ password: newPassword });

    let previousPasswords: string[] = [];

    try {
      if (user.previousPasswords.length === 0) {
        previousPasswords = [];
      } else {
        previousPasswords = JSON.parse(user.previousPasswords);
      }
    } catch (error) {
      throw new Error('Failed to parse previous passwords');
    }

    previousPasswords.push(newPassword);
    if (previousPasswords.length > 3) {
      previousPasswords.shift();
    }
  
    await user.update({
      password: newPassword,
      previousPasswords: JSON.stringify(previousPasswords),
      lastTimePasswordUpdate: new Date(Date.now()),
      passwordExpired: false
    });
  }

  public static async checkPasswordUniqueness(userId: string, newPassword: string): Promise<boolean>{
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    let previousPasswords: string[] = [];
    try {
      if (user.previousPasswords.length === 0) {
        previousPasswords = [];
      } else {
        previousPasswords = JSON.parse(user.previousPasswords);
      }
    } catch (error) {
      throw new Error('Failed to parse previous passwords');
    }

    for (const previousPassword of previousPasswords) {
      const match = await bcrypt.compare(newPassword, previousPassword);
      if (match) {
        return false; // Password has been used before
      }
    }

    return true;
  }
  // get user by email
  public static async getUserByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }
  public static async getUserNames(
    id: string,
  ): Promise<{ firstname: string; lastname: string } | null> {
    const result = await User.findOne({ where: { user_id: id } });
    if (!result) {
      return null;
    }
    return {
      firstname: result.firstname || '',
      lastname: result.lastname || '',
    };
  }
}


export default AuthService;
