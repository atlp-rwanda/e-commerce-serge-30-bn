import { Request, Response } from 'express';
import { User } from '../models';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { getGoogleOAuthToken, getGoogleUser } from '../service/google.service';

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
      } catch (error) {
        console.error('Error creating user:', error);
        return res.redirect('http://localhost:3000/error');
      }
    }

    const JWT_SECRET = process.env.JWT_SECRET as string;
    const authToken = jwt.sign({ googleUser }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res
      .header('Authorization', `Bearer ${authToken}`)
      .cookie('Authorization', authToken, {
        httpOnly: true,
        maxAge: 60 * 600 * 1000,
        sameSite: 'lax',
        secure: true,
      })
      .redirect('http://localhost:3000');
  } catch (error) {
    return res.redirect('http://localhost:3000/error');
  }
}
