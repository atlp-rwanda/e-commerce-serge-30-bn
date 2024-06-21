import Payment, { PaymentMethod, PaymentStatus } from '../models/payment.model';

class PaymentService {
  public static async createPayment(
    userId: string,
    orderId: string,
    amount: number,
    stripeId: string,
  ){
    const createPayment = await Payment.create({
      userId,
      orderId,
      amount,
      StripeId: stripeId,
      payment_method: PaymentMethod.Stripe,
      payment_status: PaymentStatus.Pending,
      stripeId: stripeId,
    });

    return createPayment;
  }

  public static async updatePaymentStatus(
    userId: string,
    orderId: string,
    stripeId: string,
    newStatus: PaymentStatus,
  ) {
    await Payment.update(
      {
        payment_status: newStatus,
      },
      {
        where: {
          userId,
          orderId,
          stripeId,
          payment_status: PaymentStatus.Pending,
        },
      },
    );
  }

  public static async findPendingPayment(
    userId: string,
    orderId: string,
  ): Promise<Payment | null> {
    const payment = await Payment.findOne({
      where: {
        userId,
        orderId,
        payment_status: PaymentStatus.Pending,
      },
    });

    return payment;
  }
  public static async getAllPayments(userId:string) :  Promise<Payment[] | null>{
    const payments = await Payment.findAll({where: {userId}});
    if (!payments) {
      throw new Error('payments not found');
    }
    return payments;
  }
  public static async adminGetAllPayments() :  Promise<Payment[] | null>{
    const payments = await Payment.findAll();
    if (!payments) {
      throw new Error('payments not found');
    }
    return payments;
  }

}

export default PaymentService;