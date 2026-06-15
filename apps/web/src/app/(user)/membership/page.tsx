import { Suspense } from 'react';
import { Metadata } from 'next';
import MembershipPage from '@/domain/membership/MembershipPage';

export const metadata: Metadata = {
  title: '렛츠커리어 하반기 멤버십 | 자소서·인적성·면접 3개월 패스',
  description:
    '7~9월 공채 시즌, 가이드북·챌린지·스터디·VOD·멘토링을 하나의 멤버십으로. 선착순 100명 한정.',
};

export default function Page() {
  return (
    <Suspense>
      <MembershipPage />
    </Suspense>
  );
}
