import Strip from 'stripe';

export const stripe = new Strip(process.env.STRIPE_API_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true
});
