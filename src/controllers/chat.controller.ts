/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { Request, Response } from 'express';
import { join } from 'path';
import { logger } from '../config/Logger';
import { ChatService } from '../service/chat.service';
export const chatApplication = (req: Request, res: Response) => {
  const filePath = join(__dirname, '../../public/index.html');
  res.sendFile(filePath);
};
export const chats = async (req: Request, res: Response) => {
  try {
    const chat = await ChatService.getAllChats();
    return res.status(200).json({ ok: true, chat });
  } catch (error) {
    logger.error('Get Chats: ', error);
    return res.status(500).json({ ok: false, message: 'failed to get chats' });
  }
};
