import { Response } from 'express';

import { initiateMoMoPaymentService } from '../service/momo.service';
import NotificationEvents from '../service/event.service';

export const initiateMoMoPayment = async (
  req: CustomRequest,
  res: Response,
) => {
  try {
    const paymentRequest = req.body;
    const user = req.user;

    if (!user) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const payment = await initiateMoMoPaymentService(user, paymentRequest);
    NotificationEvents.emit("makemomoPayment",paymentRequest,user.user_id);
    return res
      .status(200)
      .json({ message: 'Order paid successfully', payment });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Order not found') {
        return res.status(404).json({ message: error.message });
      } else if (error.message === 'Order is already paid') {
        return res.status(400).json({ message: error.message });
      } else if (error.message === 'User not authenticated') {
        return res.status(403).json({ message: error.message });
      } else {
        return res.status(500).json({ error: error.message });
      }
    }
  }
};
