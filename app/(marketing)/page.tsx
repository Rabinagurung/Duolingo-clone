import { Button } from '@/components/ui/button';
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton
} from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='max-w-[988] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2'>
      <div className='relative w-[240px] h-[240px] lg:w-[424px] mb-8 lg:mb-0 '>
        <Image src='/hero.svg' alt='Hero' fill />
      </div>
      <div className='flex flex-col items-center gap-y-8'>
        <h1 className='text-xl lg:text-3xl font-bold text-neutral-600 max-w-[480px] text-center'>
          Learn, practice, and master languages on Duolingo.
        </h1>
        <div className='flex flex-col items-center gap-y-3 max-w-[330px] w-full'>
          <ClerkLoading>
            <Loader className='h-5 w-5 text-muted-foreground animate-spin' />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedOut>
              <SignUpButton
                mode='modal'
                forceRedirectUrl='/learn'
                signInForceRedirectUrl='/learn'>
                <Button className='lg w-full' variant='secondary'>
                  Get Started
                </Button>
              </SignUpButton>
              <SignInButton
                mode='modal'
                forceRedirectUrl='/learn'
                signUpForceRedirectUrl='/learn'>
                <Button className='lg w-full' variant='primaryOutline'>
                  I already have an account
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button className='lg w-full' variant='secondary' asChild>
                <Link href='/learn'>Continue Learning</Link>
              </Button>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
}
