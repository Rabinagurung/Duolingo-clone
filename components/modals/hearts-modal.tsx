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
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useHeartsModal } from '@/store/use-hearts-modal';

export const HeartsModal = () => {
  const router = useRouter();
  const [client, setClient] = useState(false);
  const { isOpen, closeModal } = useHeartsModal();

  useEffect(() => {
    setClient(true);
  }, []);

  const onClick = () => {
    closeModal();
    router.push('/store');
  };

  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <div className='flex items-center justify-center mb-5 w-full'>
            <Image src='/mascot_bad.svg' alt='mascot' width={80} height={80} />
          </div>
          <DialogTitle className='text-center font-bold text-2xl'>
            You are out of hearts!
          </DialogTitle>
          <DialogDescription className='text-center text-base'>
            Get Pro to get unlimited hearts and continue learning.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='mb-4'>
          <div className='flex w-full flex-col gap-y-4'>
            <Button
              variant='primary'
              size='lg'
              className='w-full'
              onClick={onClick}>
              Get Pro
            </Button>

            <Button
              variant='primaryOutline'
              size='lg'
              className='w-full'
              onClick={() => {
                closeModal();
              }}>
              No Thanks
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
