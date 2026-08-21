import { Metadata } from 'next';
import MembershipLanding from '@/domain/membership/MembershipLanding';

// [LC-3219-MEMBERSHIP] 멤버십 랜딩 메타데이터 — 시즌 종료 시 페이지를 통째로 내릴 때만 손댄다.
// 시즌 표기(9~11월)가 들어 있으므로 다음 시즌에는 이 문장도 함께 고친다.
export const metadata: Metadata = {
  title: '렛츠커리어 하반기 멤버십 | 자소서·인적성·면접 3개월 패스',
  description:
    '9~11월 하반기 공채 시즌, 가이드북·챌린지·VOD·멘토링을 하나의 멤버십으로.',
};

// 글로벌 헤더·푸터(ConditionalLayout)는 유지하고, 멤버십 랜딩을 본 웹앱에 직접 마운트한다.
export default function Page() {
  return <MembershipLanding />;
}
