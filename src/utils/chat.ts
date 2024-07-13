import { Socket, Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { decodToken } from './jwt.utils';
import { logger } from '../config/Logger';
import Chat from '../models/chat.model';
import AuthService from '../service/auth.service';
interface CustomSocket extends Socket {
  userId?: string;
}
export const findId = (socket: CustomSocket) => {
  try {
    const { token } = socket.handshake.auth;
    const decoded = decodToken(token);
    let id: string;

    if (typeof decoded === 'string') {
      id = decoded;
    } else if (decoded && decoded.user && decoded.user.user_id) {
      id = decoded.user.user_id;
    } else {
      throw new Error('Invalid token structure');
    }

    socket.emit('sendUserId', id);
    socket.userId = id;
    return id;
  } catch (error) {
    logger.error('Error finding ID', error);
  }
};
interface Message {
  socketId: string;
  content: string;
  msgData: string;
}
const sentMessage = async (socket: CustomSocket, data: Message, io: Server) => {
  const senderId = socket.userId;
  if (senderId) {
    try {
      const { content, socketId } = data;
      const user = await AuthService.getUserNames(senderId as string);
      if (!user) {
        throw new Error('User not found');
      }
      const { firstname } = user;
      const chat = await Chat.create({ senderId, socketId, content });
      io.emit('returnMessage', {
        senderId: chat.dataValues.senderId,
        socketId: chat.dataValues.socketId,
        content: chat.dataValues.content,
        senderName: firstname,
        readStatus: chat.dataValues.readStatus,
        date: chat.dataValues.updatedAt,
      });
    } catch (error) {
      logger.error('Error saving a message chat to database: ', error);
    }
  }
};
const handleTyping = async (socket: CustomSocket, data: { isTyping: boolean }) => {
  const user = await AuthService.getUserNames(socket.userId as string);
  if (user) {
    socket.broadcast.emit('typing', {
      userId: socket.userId,
      isTyping: data.isTyping,
      name: user.firstname
    });
  }
};
const disconnected = () => {
  logger.info('User disconnected...');
};
export const socketSetUp = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.DEPLOYED_URL_FN,
      methods: ['GET', 'POST'],
    },
  });
  io.use(async (socket: CustomSocket, next) => {
    const id = findId(socket);
    socket.userId = id;
    next();
  });
  io.on('connection', async (socket: CustomSocket) => {
    const user = await AuthService.getUserNames(socket.userId as string);
    io.emit('welcome', user);
    socket.on('sentMessage', (data) => sentMessage(socket, data, io));
    socket.on('typing', (isTyping) => handleTyping(socket, isTyping));
    socket.on('disconnect', disconnected);
  });
};