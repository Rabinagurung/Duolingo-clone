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
import { useExitModal } from '@/store/use-exit-modal';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

export const ExitModal = () => {
  const router = useRouter();
  const [client, setClient] = useState(false);
  const { isOpen, closeModal } = useExitModal();

  useEffect(() => {
    setClient(true);
  }, []);

  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <div className='flex items-center justify-center mb-5 w-full'>
            <Image src='/mascot_sad.svg' alt='mascot' width={80} height={80} />
          </div>
          <DialogTitle className='text-center font-bold text-2xl'>
            Wait, don&apos;t go!
          </DialogTitle>
          <DialogDescription className='text-center text-base'>
            You&apos;re about to leave the lesson. Are you sure you want to
            exit?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='mb-4'>
          <div className='flex w-full flex-col gap-y-4'>
            <Button
              variant='primary'
              size='lg'
              className='w-full'
              onClick={closeModal}>
              Keep Learning
            </Button>

            <Button
              variant='dangerOutline'
              size='lg'
              className='w-full'
              onClick={() => {
                router.push('/learn');
                closeModal();
              }}>
              End session
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
