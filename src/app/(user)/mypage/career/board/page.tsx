'use client';

import CareerBoard from '@/domain/career-board';
import { CareerDataStatusProvider } from '@/domain/career-board/contexts/CareerDataStatusContext';

export default function Page() {
  return (
    <CareerDataStatusProvider>
      <CareerBoard />
    </CareerDataStatusProvider>
  );
}
