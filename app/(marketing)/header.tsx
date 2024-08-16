import { Button } from '@/components/ui/button';
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton
} from '@clerk/nextjs';
import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import Image from 'next/image';

export const Header = () => {
  return (
    <header className='h-20 w-full border-b-2 border-slate-200 px-4'>
      <div className='lg:max-w-screen mx-auto flex items-center justify-between h-full'>
        <div className='pt-8 pl-4 pb-7 flex items-center gap-x-3'>
          <Image src='/mascot.svg' alt='Logo' width={40} height={40} />
          <h1 className='text-2xl font-extrabold text-green-600 tracking-wide'>
            Duolingo
          </h1>
        </div>
        <ClerkLoading>
          <Loader className='h-5 w-5 text-muted-foreground animate-spin' />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <UserButton></UserButton>
          </SignedIn>
          <SignedOut>
            <SignInButton
              mode='modal'
              forceRedirectUrl='/learn'
              signUpForceRedirectUrl='/learn'>
              <Button className='lg' variant='ghost'>
                Login
              </Button>
            </SignInButton>
          </SignedOut>
          {/* <SignedOut /> */}
        </ClerkLoaded>
      </div>
    </header>
  );
};
