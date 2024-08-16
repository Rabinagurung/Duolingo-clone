import { getLesson, getUserProgress, getUserSubscriptions } from '@/db/queries';
import { redirect } from 'next/navigation';
import { Quiz } from './quiz';
import { userSubscriptions } from '@/db/schema';

export default async function LessonPage() {
  const lessonData = getLesson();
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscriptions() as Promise<
    typeof userSubscriptions.$inferSelect & {
      isActive: boolean;
    }
  >;

  const [lesson, userProgress, userSubscription] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscriptionData
  ]);

  if (!userProgress || !lesson) {
    redirect('/learn');
  }

  const initialPercentage =
    lesson?.challenges?.filter((challenge) => challenge.completed).length ??
    (0 / (lesson?.challenges?.length || 1)) * 100;

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialPercentage={initialPercentage}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      userSubscription={userSubscription}
    />
  );
}
