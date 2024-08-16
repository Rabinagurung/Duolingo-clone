import { FeedWrapper } from '@/components/FeedWrapper';
import { StickyWrapper } from '@/components/sticky-wrapper';
import { Header } from './header';
import { UserProgress } from '@/components/user-progress';
import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
  getUserSubscriptions
} from '@/db/queries';
import { redirect } from 'next/navigation';
import { Unit } from './unit';
import { lessons, units as unitsSchema, userSubscriptions } from '@/db/schema';
import { Promo } from '@/components/promo';
import { Quest } from '@/components/quest';

export default async function LearnPage() {
  const userProgressData = getUserProgress();
  const courseProgressData = getCourseProgress();
  const lessonPercentageData = getLessonPercentage();
  const unitsData = getUnits();
  const userSubscriptionData = getUserSubscriptions();

  const [
    userProgress,
    courseProgress,
    lesssonPercentage,
    units,
    userSubscriptions
  ] = await Promise.all([
    userProgressData,
    courseProgressData,
    lessonPercentageData,
    unitsData,
    userSubscriptionData
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect('/courses');
  }

  if (!courseProgress) {
    redirect('/courses');
  }

  return (
    <div>
      <div className='flex flex-row-reverse gap-[48px] px-6'>
        <StickyWrapper>
          <UserProgress
            activeCourse={userProgress.activeCourse}
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={!!userSubscriptions?.isActive}
          />
          {!userSubscriptions?.isActive && <Promo />}
          <Quest points={userProgress.points} />
        </StickyWrapper>
        <FeedWrapper>
          <Header title={userProgress.activeCourse.title} />
          {units.map((unit) => (
            <div key={unit.id} className='mbg-10'>
              <Unit
                id={unit.id}
                order={unit.order}
                description={unit.description}
                title={unit.title}
                lessons={unit.lessons}
                // @ts-ignore
                activeLesson={courseProgress.activeLesson}
                activeLessonPercentages={lesssonPercentage}
              />
            </div>
          ))}
        </FeedWrapper>
      </div>
    </div>
  );
}
