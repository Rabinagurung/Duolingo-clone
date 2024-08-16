'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import db from '@/db/drizzle';
import { userSubscriptions } from '@/db/schema';
import { stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';
import { getUserSubscriptions } from '@/db/queries';

const returnUrl = absoluteUrl('/shop'); // http://localhost:3000/shop

export const createStripleUrl = async () => {
  const { userId } = await auth();
  const user = await currentUser();
  if (!user || !userId) {
    throw new Error('User not found');
  }
  const userSubscription = await getUserSubscriptions();
  if (userSubscription?.stripeCustomerId) {
    console.log('User has a subscription');
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripeCustomerId,
      return_url: returnUrl
    });
    return {
      data: stripeSession.url
    };
  }
  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: user.emailAddresses[0].emailAddress,

    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Duolingo Subscription',
            description: 'Duolingo Plus Subscription'
          },
          unit_amount: 2000, // $20.00
          recurring: {
            interval: 'month'
          }
        }
      }
    ],
    metadata: {
      userId
    },
    success_url: returnUrl,
    cancel_url: returnUrl
  });
  return {
    data: stripeSession.url
  };
};
