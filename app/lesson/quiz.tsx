'use client';

import { challengeOptions, challenges, userSubscriptions } from '@/db/schema';
import { useEffect, useState, useTransition } from 'react';
import Confetti from 'react-confetti';
import { Header } from './header';
import { QuestionBubble } from './question-bubble';
import { Challenge } from './challenge';
import { Footer } from './footer';
import { upsertChallengeProgress } from '@/actions/challenge-progress';
import { toast } from 'sonner';
import { reduceHearts } from '@/actions/user-progress';
import { useAudio, useWindowSize, useMount } from 'react-use';
import Image from 'next/image';
import { ResultCard } from './result-card';
import { useRouter } from 'next/navigation';
import { useHeartsModal } from '@/store/use-hearts-modal';
import { usePracticeModal } from '@/store/use-practice-modal';

interface QuizProps {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  userSubscription:
    | (typeof userSubscriptions.$inferSelect & {
        isActive: boolean;
      })
    | null;
}
export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription
}: QuizProps) => {
  const router = useRouter();

  const [client, setClient] = useState(false);
  const { width, height } = useWindowSize();
  const { openModal: onOpenHeartsModal } = useHeartsModal();
  const { openModal: onOpenPracticeModal } = usePracticeModal();

  useMount(() => {
    if (initialPercentage === 100) {
      onOpenPracticeModal();
    }
  });

  const [lessonId] = useState(initialLessonId);
  const [correctAudio, _c, correctControls, _refCorrect] = useAudio({
    src: '/correct.wav'
  });
  const [inCorrectAudio, _ic, inCorrectControls, _refIncorrect] = useAudio({
    src: '/incorrect.wav'
  });
  const [finishAudio, _if, finishControls, _refFinish] = useAudio({
    src: '/finish.mp3',
    autoPlay: true
  });
  const [isPending, startTransition] = useTransition();
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage;
  });
  const [challenges, setChallenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });
  const [status, setStatus] = useState<'correct' | 'wrong' | 'none'>('none');

  const [selectedOption, setSelectedOption] = useState<number>();

  const currentChallenge = challenges[activeIndex];
  const options = currentChallenge?.challengeOptions || [];

  const onNext = () => {
    setActiveIndex((prevIndex) => prevIndex + 1);
  };

  const onContinue = () => {
    if (!selectedOption) return;
    if (status === 'wrong') {
      setStatus('none');
      setSelectedOption(undefined);
      return;
    }
    if (status === 'correct') {
      onNext();
      setStatus('none');
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((option) => option.correct);

    if (!correctOption) return;

    if (correctOption && selectedOption === correctOption.id) {
      startTransition(() => {
        upsertChallengeProgress(currentChallenge.id)
          .then((response) => {
            if (response?.error === 'hearts') {
              onOpenHeartsModal();
              return;
            }
            correctControls.play();
            setStatus('correct');
            setPercentage((prev) => prev + 100 / challenges.length);

            // this is a practice challenge
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch((error) => {
            toast.error('An error occurred! Please try again.');
          });
      });
    } else {
      startTransition(() => {
        reduceHearts(currentChallenge.id)
          .then((response) => {
            if (response?.error === 'hearts') {
              onOpenHeartsModal();
              return;
            }
            inCorrectControls.play();
            setStatus('wrong');
            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch((error) => {
            toast.error('An error occurred! Please try again.');
          });
      });
    }
  };
  const onSelect = (id: number) => {
    if (status !== 'none') return;
    setSelectedOption(id);
  };

  useEffect(() => {
    setClient(true);
  }, []);

  if (client === false) return null;
  if (!currentChallenge) {
    return (
      <>
        {finishAudio}
        <Confetti
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
          width={width}
          height={height}
        />
        <div className='flex flex-col gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full'>
          <Image
            src='/finish.svg'
            alt='Finish'
            width={100}
            height={100}
            className='hidden lg:block'
          />
          <Image
            src='/finish.svg'
            alt='Finish'
            width={50}
            height={50}
            className='block lg:hidden'
          />
          <h1 className='text-xl lg:text-3xl font-bold text-neutral-700'>
            Great job! <br />
            You&apos;ve completed the lesson
          </h1>
          <div className='flex items-center gap-x-4 w-full'>
            <ResultCard variant='points' value={challenges.length * 10} />
            <ResultCard variant='hearts' value={hearts} />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          disabled={isPending}
          status='completed'
          onCheck={() => router.push('/learn')}
        />
      </>
    );
  }
  const title =
    currentChallenge.type === 'ASSIST'
      ? 'Select the correct meaning'
      : currentChallenge.question;
  return (
    <>
      {inCorrectAudio}
      {correctAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />

      <div className='flex-1'>
        <div className='h-full flex items-center justify-center'>
          <div className='lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12'>
            <h1 className='text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700'>
              {title}
            </h1>
            <div>
              {currentChallenge.type === 'ASSIST' && (
                <QuestionBubble question={currentChallenge.question} />
              )}
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={isPending}
                type={currentChallenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={isPending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};
