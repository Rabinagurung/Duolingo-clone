import { FeedWrapper } from '@/components/FeedWrapper';
import { Promo } from '@/components/promo';
import { StickyWrapper } from '@/components/sticky-wrapper';
import { Progress } from '@/components/ui/progress';
import { UserProgress } from '@/components/user-progress';
import { getUserProgress, getUserSubscriptions } from '@/db/queries';
import { quests } from '@/lib/constants';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function QuestsPage() {
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
        {!userSubscription?.isActive && <Promo />}
      </StickyWrapper>
      <FeedWrapper>
        <div className='w-full flex flex-col items-center'>
          <Image src='/quests.svg' alt='Quests' width={90} height={90} />
          <h1 className='text-neutral-800 my-6 text-2xl font-bold mt-6 text-cneter'>
            Quests
          </h1>
          <p className='text-muted-foreground text-center text-lg mb-6'>
            Complete quests by completing tasks and earn points
          </p>
          <ul className='w-full'>
            {quests.map((quest) => {
              const progress = (userProgress.points / quest.value) * 100;
              return (
                <li
                  key={quest.title}
                  className='flex items-center w-full p-4 gap-x-4 border-t-2'>
                  <Image
                    src='/points.svg'
                    alt='points'
                    width={60}
                    height={60}
                  />
                  <div className='flex flex-col gap-y-2 w-full'>
                    <p className='text-neutral-700 text-xl font-bold'>
                      {quest.title}
                    </p>
                    <Progress value={progress} className='h-3' />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </FeedWrapper>
    </div>
  );
}
