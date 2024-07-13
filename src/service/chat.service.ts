import Chat from '../models/chat.model';
export class ChatService {
  public static async getAllChats() {
    const chats = await Chat.findAll({});
    return chats;
  }
}