import jwt from 'jsonwebtoken'
import User from "../models/user.model"
interface Payload {
  user:User
}
const generateToken = (payload: Payload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || '', { expiresIn: '1h' });
};
// this method will validate jwt sent by clients to secure routes that need authentication

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWTTOKEN || '')
  } catch (error) {
    throw new Error('Invalid token')
  }
}
const decodToken = (token: string) => {
  return jwt.decode(token);
};
export { generateToken, verifyToken, decodToken }