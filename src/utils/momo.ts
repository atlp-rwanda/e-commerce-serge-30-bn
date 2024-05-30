import { Buffer } from 'buffer';
import { logger } from '../config/Logger';
if (
  !process.env.MTN_API_BASE_URL ||
  !process.env.SUBSCRIPTION_KEY ||
  !process.env.CLIENT_ID ||
  !process.env.CLIENT_SECRET
) {
  logger.info('Missing environment variables');
}
export const momoConfig = {
  apiBaseUrl: process.env.MTN_API_BASE_URL,
  subscriptionKey: process.env.SUBSCRIPTION_KEY,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};

export const encodeBasicAuth = (
  clientId: string,
  clientSecret: string,
): string => {
  const credentials = `${clientId}:${clientSecret}`;
  return Buffer.from(credentials).toString('base64');
};
