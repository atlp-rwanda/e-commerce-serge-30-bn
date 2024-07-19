/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { OrderService } from '../service/order.service';
import { ProductService } from '../service/index';
import NotificationEvents from '../service/event.service';
import { VendorService } from '../service/vendor.service';

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
    const orderData = await OrderService.getOrderById(orderId);
    if (!orderData) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const products = orderData.dataValues.products;
    const productData = await Promise.all(
      products.map(async (product: { productId: string; quantity: number }) => {
        const productDetail = await ProductService.getProductById(
          product.productId,
        );
        if (productDetail) {
          return {
            ...productDetail.dataValues,
            orderQuantity: product.quantity,
          };
        } else {
          return null;
        }
      }),
    ).then((results) => results.filter((result) => result !== null));

    if (productData.length === 0) {
      return res
        .status(400)
        .json({ message: 'No valid products found in the order' });
    }

    const lineItems = productData.map((product) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          description: product.description,
          metadata: {
            productId: product.product_id,
            vendorId: product.vendor_id,
            categoryId: product.category_id,
          },
        },
        unit_amount: product.price * 100,
      },
      quantity: product.orderQuantity,
    }));

    const metadata = {
      userId: user.user_id,
      orderId: orderId,
    };

    const session = await createStripeSession(
      lineItems,
      metadata,
      success_url,
      cancel_url,
    );

    const createPayment = await PaymentService.createPayment(
      metadata.userId,
      metadata.orderId,
      session.amount_total || 0,
      session.id,
    );
    NotificationEvents.emit('makePayment', orderData, user.user_id);
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

      return res.redirect(
        `${process.env.SUCCESS_REDIRECT_URL}/payment/success`,
      );
    } else {
      return res.redirect(
        `${process.env.SUCCESS_REDIRECT_URL}/payment/failure`,
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.redirect(
        `${process.env.SUCCESS_REDIRECT_URL}/payment/failure`,
      );
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
      return res.redirect(
        `${process.env.SUCCESS_REDIRECT_URL}/payment/failure`,
      );
    }

    await PaymentService.updatePaymentStatus(
      String(userId),
      String(orderId),
      payment.stripeId,
      PaymentStatus.Canceled,
    );
    await deleteSession(payment.stripeId);
    return res.redirect(`${process.env.SUCCESS_REDIRECT_URL}/payment/failure`);
  } catch (error) {
    if (error instanceof Error) {
      return res.redirect(
        `${process.env.SUCCESS_REDIRECT_URL}/payment/failure`,
      );
    }
  }
}

export const getAllPayments = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    let payments = await PaymentService.getAllPayments(req.user.user_id);
    const role = req.user.role;

    if (role === 'ADMIN') {
      payments = await PaymentService.adminGetAllPayments();
    }
    if (role === 'VENDOR') {
      const vendor = await VendorService.getVendorByAuthenticatedUserId(
        req.user.user_id,
      );
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
      payments = await PaymentService.getAllPayments(vendor.user_id);
    }
    if (!payments || payments.length < 1) {
      return res.status(404).json({
        success: false,
        message: 'you have no payments',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'payments retrieved successfully',
      data: payments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { makepaymentsession, paymentSuccess, paymentCancel };
