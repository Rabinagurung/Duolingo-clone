import { FeedWrapper } from '@/components/FeedWrapper';
import { StickyWrapper } from '@/components/sticky-wrapper';
import { UserProgress } from '@/components/user-progress';
import {
  getTopTenUsers,
  getUserProgress,
  getUserSubscriptions
} from '@/db/queries';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Promo } from '@/components/promo';
import { Quest } from '@/components/quest';

export default async function LeaderboardPage() {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscriptions();
  const leaderboardData = getTopTenUsers();
  const [userProgress, userSubscription, leaderboard] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    leaderboardData
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
        <Quest points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <div className='w-full flex flex-col items-center'>
          <Image
            src='/leaderboard.svg'
            alt='leaderboard'
            width={90}
            height={90}
          />
          <h1 className='text-neutral-800 my-6 text-2xl font-bold mt-6 text-cneter'>
            Leaderboard
          </h1>
          <p className='text-muted-foreground text-center text-lg mb-6'>
            See how you compare to other learners in the community.
          </p>
          <Separator className='mb-4 h-0.5 rounded-full' />
          {leaderboard.map((user, index) => (
            <div
              key={user.userId}
              className='flex items-center w-full p-2 px-4 rounded-xl gap-x-4 hover:bg-gray-200/50'>
              <p className='font-bold text-lime-700 mr-4'>{index + 1}</p>
              <Avatar className='border bg-green-500 size-12 ml-3 mr-6'>
                <AvatarImage
                  className='obgject-cover'
                  src={user.userImageSrc}
                />
              </Avatar>
              <p className='text-neutral-800 flex-1 font-bold'>
                {user.userName}
              </p>
              <p className='text-muted-foreground'>{user.points} XP</p>
            </div>
          ))}
        </div>
      </FeedWrapper>
    </div>
  );
}
