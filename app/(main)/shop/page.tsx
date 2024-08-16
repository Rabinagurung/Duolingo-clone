import { FeedWrapper } from '@/components/FeedWrapper';
import { StickyWrapper } from '@/components/sticky-wrapper';
import { UserProgress } from '@/components/user-progress';
import { getUserProgress, getUserSubscriptions } from '@/db/queries';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import Items from './items';
import { Quest } from '@/components/quest';

export default async function ShopPage() {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscriptions();
  const [userProgress, userSubscription] = await Promise.all([
    userProgressData,
    userSubscriptionData
  ]);
  if (!userProgress || !userProgress.activeCourse) {
    redirect('/courses');
  }
  return (
    <div className='flex flex-row-reverse gap-[48px] px-6'>
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={!!userSubscription?.isActive}
        />

        <Quest points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <div className='w-full flex flex-col items-center'>
          <Image src='/shop.svg' alt='shop' width={90} height={90} />
          <h1 className='text-neutral-800 my-6 text-2xl font-bold mt-6 text-cneter'>
            Shop
          </h1>
          <p className='text-muted-foreground text-center text-lg mb-6'>
            Spend your points on cool stuff.
          </p>
          <Items
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={!!userSubscription?.isActive}
          />
        </div>
      </FeedWrapper>
    </div>
  );
}
