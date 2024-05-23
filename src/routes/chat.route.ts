import { Router } from 'express';
import { chatApplication, chats } from '../controllers/chat.controller';
import { isAuthenticated } from '../middleware/authentication/auth.middleware';

const chatRoute = Router();

chatRoute.get('/chats/chatApp', chatApplication);
chatRoute.get('/chats/all', isAuthenticated, chats);
export default chatRoute;
