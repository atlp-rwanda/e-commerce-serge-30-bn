import {
  createStripeSession,
  checkPaymentStatus,
  deleteSession,
} from '../utils/stripe';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import PaymentService from '../service/payment.service';
import { PaymentStatus } from '../models/payment.model';
import Stripe from 'stripe';

dotenv.config();

async function makepaymentsession(req: CustomRequest, res: Response) {
  const { user } = req;
  const { orderId } = req.body;
  if (!user) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const baseUrl = process.env.BASE_URL || '';
  const success_url = `${baseUrl}/api/v1/payment/success?userId=${user.user_id}&orderId=${orderId}`;
  const cancel_url = `${baseUrl}/api/v1/payment/cancel?userId=${user.user_id}&orderId=${orderId}`;

  try {
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },

          unit_amount: 90,
        },

        quantity: 1,
      },
    ];

    const metadata = {
      userId: user.user_id,
      orderid: orderId,
    };

    const session = await createStripeSession(
      lineItems,
      metadata,
      success_url,
      cancel_url,
    );

    const createPayment = await PaymentService.createPayment(
      metadata.userId,
      metadata.orderid,
      session.amount_total || 0,
      session.id,
    );

    return res.status(200).json({
      message:
        'Session started successfully. You can continue with your payment',
      session,
      createPayment,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }
  }
}

async function paymentSuccess(req: Request, res: Response) {
  const { userId, orderId } = req.query;

  if (!userId || !orderId) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }
  try {
    const payment = await PaymentService.findPendingPayment(
      String(userId),
      String(orderId),
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const session: Stripe.Checkout.Session = await checkPaymentStatus(
      payment.stripeId,
    );

    if (session.payment_status === 'paid') {
      await PaymentService.updatePaymentStatus(
        String(userId),
        String(orderId),
        payment.stripeId,
        PaymentStatus.Completed,
      );

      return res.status(200).json({ message: 'Payment successful' });
    } else {
      return res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }
  }
}

async function paymentCancel(req: Request, res: Response) {
  const { userId, orderId } = req.query;

  if (!userId || !orderId) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    const payment = await PaymentService.findPendingPayment(
      String(userId),
      String(orderId),
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    await PaymentService.updatePaymentStatus(
      String(userId),
      String(orderId),
      payment.stripeId,
      PaymentStatus.Canceled,
    );
    await deleteSession(payment.stripeId);
    return res.status(200).json({ message: 'Payment canceled' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }
  }
}

export { makepaymentsession, paymentSuccess, paymentCancel };
