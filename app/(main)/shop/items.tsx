'use client';

import { refillHearts } from '@/actions/user-progress';
import { createStripleUrl } from '@/actions/user-subscription';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface ItemsProps {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
}

const POINTS_TO_REFILL_HEART = 10;

export default function Items({
  hearts,
  points,
  hasActiveSubscription
}: ItemsProps) {
  const [pending, startTransition] = useTransition();

  const onRefillHearts = () => {
    if (hearts === 5 || points < POINTS_TO_REFILL_HEART || pending) return;

    startTransition(() => {
      refillHearts().catch(() => toast.error('Failed to refill hearts'));
    });
  };

  const onUpgradeSubscription = () => {
    startTransition(() => {
      createStripleUrl()
        .then((res) => {
          if (res.data) {
            window.location.href = res.data;
          }
        })
        .catch(() => toast.error('Failed to upgrade subscription'));
    });
  };
  return (
    <ul className='w-full'>
      <div className='flex items-center p-4 gap-x-4 border-t-2'>
        <Image src='/heart.svg' alt='heart' width={60} height={60} />
        <div className='flex-1'>
          <p className='text-neutral-700 text-base lg:text-xl font-bold'>
            Refill hearts
          </p>
        </div>
        <Button
          disabled={pending || hearts === 5 || points < POINTS_TO_REFILL_HEART}
          onClick={onRefillHearts}>
          {hearts === 5 ? (
            'Full'
          ) : (
            <div className='flex items-center'>
              <Image src='/points.svg' alt='points' width={20} height={20} />
              <p>{POINTS_TO_REFILL_HEART}</p>
            </div>
          )}
        </Button>
      </div>
      <div className='flex items-center w-full p-4 pt-8 gap-x-4 border-t-2'>
        <Image src='/unlimited.svg' alt='unlimited' width={60} height={60} />
        <div className='flex-1'>
          <p className='text-neutral-700 text-base lg:text-xl font-bold'>
            Unlimited hearts
          </p>
        </div>
        <Button disabled={pending} onClick={onUpgradeSubscription}>
          {hasActiveSubscription ? 'Settings' : 'Buy'}
        </Button>
      </div>
    </ul>
  );
}
