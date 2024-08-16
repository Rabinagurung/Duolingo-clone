import { getLesson, getUserProgress, getUserSubscriptions } from '@/db/queries';
import { redirect } from 'next/navigation';
import { Quiz } from '../quiz';
import { userSubscriptions } from '@/db/schema';

type LessonIdPageProps = {
  params: {
    lessonId: number;
  };
};

export default async function LessonIdPage({ params }: LessonIdPageProps) {
  const lessonData = getLesson(params.lessonId);
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscriptions();

  const [lesson, userProgress, userSubscriptions] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscriptionData
  ]);

  if (!userProgress || !lesson) {
    redirect('/learn');
  }

  const initialPercentage =
    (lesson.challenges.filter((challenge) => challenge.completed).length /
      lesson.challenges.length) *
    100;

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialPercentage={0}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      userSubscription={userSubscriptions}
    />
  );
}
