'use client';

import { CareerDataStatusProvider } from '@/domain/career-board/contexts/CareerDataStatusContext';
import dynamic from 'next/dynamic';

const CareerBoard = dynamic(() => import('@/domain/career-board'), {
  ssr: false,
});

export default function Page() {
  return (
    <CareerDataStatusProvider>
      <CareerBoard />
    </CareerDataStatusProvider>
  );
}
