'use client';
import Image from 'next/image';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { usePracticeModal } from '@/store/use-practice-modal';

export const PracticeModal = () => {
  const [client, setClient] = useState(false);
  const { isOpen, closeModal } = usePracticeModal();

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <div className='flex items-center justify-center mb-5 w-full'>
            <Image src='/heart.svg' alt='heart' width={100} height={100} />
          </div>
          <DialogTitle className='text-center font-bold text-2xl'>
            Practice Lesson
          </DialogTitle>
          <DialogDescription className='text-center text-base'>
            Use this feature to practice the lesson you just learned. You can
            regain hearts by practicing. You cannot lose hearts in practice.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='mb-4'>
          <div className='flex w-full flex-col gap-y-4'>
            <Button
              variant='primary'
              size='lg'
              className='w-full'
              onClick={closeModal}>
              I understand
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
