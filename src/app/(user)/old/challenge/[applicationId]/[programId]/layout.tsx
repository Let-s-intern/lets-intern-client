'use client';

import { OldCurrentChallengeProvider } from '@/context/OldCurrentChallengeProvider';
import OldChallengeLayout from '@components/common/challenge/ui/layout/OldChallengeLayout';

export default function OldChallengeLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OldCurrentChallengeProvider>
      <OldChallengeLayout>{children}</OldChallengeLayout>
    </OldCurrentChallengeProvider>
  );
}
