import VerifyToken from '../models/verifytokens.model';
import { UUID } from 'crypto';
interface VerifyTokenData {
  email: string;
  token: string;
  expirationTime: Date;
  user_id: UUID;
}

export class VerifyTokenService {
  static async createToken(userData: VerifyTokenData): Promise<VerifyToken> {
    try {
      const newToken = await VerifyToken.create({
        email: userData.email,
        token: userData.token,
        expirationTime: userData.expirationTime,
        user_id: userData.user_id,
      });

      return newToken;
    } catch (error) {
      throw new Error('Could not create newToken: ' + error);
    }
  }

  public static async findEmailAndToken(
    email: string,
    token: string,
  ): Promise<VerifyToken | null> {
    try {
      const UserWithEmailAndToken = await VerifyToken.findOne({
        where: { email, token },
      });

      return UserWithEmailAndToken;
    } catch (error) {
      throw new Error('Could not Find user: ' + error);
    }
  }
}
