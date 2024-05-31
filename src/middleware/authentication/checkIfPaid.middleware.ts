import { Response, NextFunction } from 'express';
import Payment from '../../models/payment.model';
import { Op } from 'sequelize';
import Order from '../../models/order.model';

export const checkIfPaid = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new Error('unauthorized');
    }
    const userId = req.user.user_id;
    const { id } = req.params; //product's
    const orders = await Order.findAll({
      where: {
        products: {
          [Op.contains]: [
            {
              productId: id,
            },
          ],
        },
        userId: userId, 
      },
    });

    if (orders.length === 0) {
      throw new Error('no order made for this product')
    }
    const orderIds = orders.map((order:Order) => order.id);

    const payments = await Payment.findAll({
      where: {
        orderId: {
          [Op.in]: orderIds
        },
        payment_status: 'Completed'
      }
    });
    const hasCompletedPayment = payments.length > 0;
    if (!hasCompletedPayment) {
    throw new Error('Product not paid')
    } 
    next();
  }  catch (error) {
    let errormsg = 'unknown error occurred';
    if (error instanceof Error) {
      errormsg = error.message;
    }
    res.status(403).send({
      message: 'You must make a payment for the product to perform this action',
      error: errormsg,
    });
    return;
  }
};

