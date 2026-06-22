import { Metadata } from 'next';
import MembershipLanding from '@/domain/membership/MembershipLanding';

export const metadata: Metadata = {
  title: '렛츠커리어 하반기 멤버십 | 자소서·인적성·면접 3개월 패스',
  description:
    '7~9월 공채 시즌, 가이드북·챌린지·스터디·VOD·멘토링을 하나의 멤버십으로. 선착순 100명 한정.',
};

// 글로벌 헤더·푸터(ConditionalLayout)는 유지하고, 멤버십 랜딩을 본 웹앱에 직접 마운트한다.
export default function Page() {
  return <MembershipLanding />;
}
