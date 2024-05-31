import Chat from '../models/chat.model';
import User from '../models/user.model';
export class ChatService {
  public static async getAllChats() {
    const chats = await Chat.findAll({
      include: {
        model: User,
        attributes: ['firstname', 'lastname'],
      },
      attributes: ['id', 'senderId', 'socketId', 'content', 'updatedAt'],
    });
    return chats;
  }
}
