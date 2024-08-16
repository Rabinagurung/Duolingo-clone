'use client';

import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import Link from 'next/link';
import Image from 'next/image';

type SidebarItemProps = {
  label: string;
  iconSrc: string;
  href: string;
};
export const SidebarItem = ({ label, iconSrc, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Button
      variant={active ? 'sidebarOutline' : 'sidebar'}
      className='justify-start h-[52px]'
      asChild>
      <Link href={href}>
        <Image
          className='mr-2 size-8'
          src={iconSrc}
          alt={label}
          width={24}
          height={24}
        />
        {label}
      </Link>
    </Button>
  );
};
