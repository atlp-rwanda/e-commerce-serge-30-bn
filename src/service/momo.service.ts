import axios, { AxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { momoConfig, encodeBasicAuth } from '../utils/momo';
import Payment, { PaymentMethod, PaymentStatus } from '../models/payment.model';
import { User } from '../models';
import Order from "../models/order.model"

interface MoMoPaymentRequest {
  amount: number;
  orderId: string;
  phoneNumber: string;
}
interface PaymentRequest {
  orderId: string;
  phoneNumber: string;
}
export const generateAccessToken = async (): Promise<string> => {
  const clientId = momoConfig.clientId;
  const clientSecret = momoConfig.clientSecret;

  if (!clientId || !clientSecret) {
    return Promise.reject(
      new Error('Client ID and Client Secret are required'),
    );
  }

  const options: AxiosRequestConfig = {
    method: 'POST',
    url: `${momoConfig.apiBaseUrl}/collection/token/`,
    headers: {
      'Ocp-Apim-Subscription-Key': momoConfig.subscriptionKey,
      Authorization: `Basic ${encodeBasicAuth(clientId, clientSecret)}`,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.access_token;
  } catch (error) {
    throw new Error(
      `Failed to generate access token: ${(error as Error).message}`,
    );
  }
};

export const requestPayment = async (
  paymentRequest: MoMoPaymentRequest,
  accessToken: string,
): Promise<{ referenceId: string; paymentStatus: number }> => {
  const referenceId = uuidv4();
  const options: AxiosRequestConfig = {
    method: 'POST',
    url: `${momoConfig.apiBaseUrl}/collection/v1_0/requesttopay`,
    headers: {
      'Content-Type': 'application/json',
      'X-Target-Environment': 'sandbox',
      'Ocp-Apim-Subscription-Key': momoConfig.subscriptionKey,
      'X-Reference-Id': referenceId,
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      amount: paymentRequest.amount.toString(),
      currency: 'EUR',
      externalId: paymentRequest.orderId,
      payer: { partyIdType: 'MSISDN', partyId: paymentRequest.phoneNumber },
      payerMessage: 'Pay for shopping',
      payeeNote: 'Shopping almost done',
    },
  };

  try {
    const response = await axios.request(options);
    return { referenceId, paymentStatus: response.status };
  } catch (error) {
    throw new Error(`Failed to request payment: ${(error as Error).message}`);
  }
};

export const getPaymentStatus = async (
  referenceId: string,
  accessToken: string,
) => {
  const options: AxiosRequestConfig = {
    method: 'GET',
    url: `${momoConfig.apiBaseUrl}/collection/v2_0/payment/${referenceId}`,
    headers: {
      'Content-Type': 'application/json',
      'X-Target-Environment': 'sandbox',
      'Ocp-Apim-Subscription-Key': momoConfig.subscriptionKey,
      'X-Reference-Id': referenceId,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get payment status: ${error.message}`);
    }
  }
};

export const initiateMoMoPaymentService = async (
  user: User,
  paymentRequest: PaymentRequest,
) => {
  const { orderId, phoneNumber } = paymentRequest;

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Generate access token
  const accessToken = await generateAccessToken();

  // Get order by id
  const orderExist = await Order.findByPk(orderId);
  if (!orderExist) {
    throw new Error('Order not found');
  }

  // Check if the order is already paid
  const orderAlreadyPaid = await Payment.findOne({
    where: { orderId, payment_status: PaymentStatus.Completed },
  });
  if (orderAlreadyPaid) {
    throw new Error('Order is already paid');
  }

  // Request payment
  const { paymentStatus, referenceId } = await requestPayment(
    {
      amount: orderExist.totalPrice,
      orderId,
      phoneNumber,
    },
    accessToken,
  );

  // Create a new payment record in the database
  const payment = await Payment.create({
    userId: user.user_id,
    orderId,
    amount: orderExist.totalPrice,
    payment_method: PaymentMethod.MOMO,
    payment_status:
      paymentStatus === 202 ? PaymentStatus.Pending : PaymentStatus.Failed,
    momoId: referenceId,
  });

  // Check payment status and update the database if the payment is successful
  if (paymentStatus === 202) {
    const paymentStatusResponse = await getPaymentStatus(
      referenceId,
      accessToken,
    );

    if (paymentStatusResponse.status === 'SUCCESSFUL') {
      payment.payment_status = PaymentStatus.Completed;
      await payment.save();
    }
  }

  return payment;
};
