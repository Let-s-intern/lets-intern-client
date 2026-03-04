'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useIsMentorQuery } from '@/api/user/user';

export const MentorGuard: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();

  const { data: isMentor, isLoading } = useIsMentorQuery();

  useEffect(() => {
    if (isLoading) return;
    if (!isMentor) router.push('/');
  }, [isMentor, isLoading, router]);

  if (isLoading) return null;
  if (!isMentor) return null;

  return <>{children}</>;
};
