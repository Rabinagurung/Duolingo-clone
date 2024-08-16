import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Footer } from './footer';

type ResultCardProps = {
  variant: 'points' | 'hearts';
  value: number;
};

export const ResultCard: React.FC<ResultCardProps> = ({ variant, value }) => {
  const imageSrc = variant === 'hearts' ? '/heart.svg' : '/points.svg';
  return (
    <div
      className={cn(
        'rounded-2xl border-2 w-full',
        variant === 'points' && 'bg-orange-400 border-orange-400',
        variant === 'hearts' && 'bg-rose-500 border-rose-500'
      )}>
      <div
        className={cn(
          'p-1.5 text-white rounded-t-xl font-bold text-center uppercase text-xs',
          variant === 'hearts' && 'bg-rose-500',
          variant === 'points' && 'bg-orange-400'
        )}>
        {variant === 'hearts' ? 'Hearts Lest' : 'Total XP'}
      </div>
      <div
        className={cn(
          'rounded-2xl bg-white items-center flex justify-center p-6 font-bold text-lg',
          variant === 'hearts' && 'text-rose-500',
          variant === 'points' && 'text-orange-400'
        )}>
        <Image
          src={imageSrc}
          alt={variant}
          width={30}
          height={30}
          className='mr-1.5'
        />
        {value}
      </div>
    </div>
  );
};
