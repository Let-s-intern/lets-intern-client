'use client';

// TODO: next/ → react-router-dom 또는 공유 어댑터로 교체 필요 (Vite 이전)
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useIsAdminQuery, useIsMentorQuery } from '@/api/user/user';

export const AdminGuard: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();

  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdminQuery();
  const { data: isMentor, isLoading: isMentorLoading } = useIsMentorQuery();

  const isLoading = isAdminLoading || isMentorLoading;
  const isUser = !isAdmin && !isMentor;

  useEffect(() => {
    if (isLoading || isMentorLoading) return;
    if (!isAdmin && !isMentor) router.push('/');
  }, [isAdmin, isMentor, isLoading, isMentorLoading, router]);

  if (isLoading) return null;
  if (isUser) return null;

  return <>{children}</>;
};
