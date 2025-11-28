'use client';

import CareerBoard from '@components/career-board';
import { CareerDataStatusProvider } from '@components/career-board/contexts/CareerDataStatusContext';

export default function Page() {
  return (
    <CareerDataStatusProvider>
      <CareerBoard />
    </CareerDataStatusProvider>
  );
}
