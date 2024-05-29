
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_API_KEY || '', {
  apiVersion: '2024-04-10',
});

export async function createStripeSession(
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  metadata: Stripe.MetadataParam,
  success_url: string,
  cancel_url: string,
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: success_url,
    cancel_url: cancel_url,
    metadata: metadata,
  });

  return session;
}
//check payment status by session id

export async function checkPaymentStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
}

//delete session by session id
export async function deleteSession(sessionId: string) {
  await stripe.checkout.sessions.expire(sessionId);
}
