import { Metadata } from 'next';
import MembershipLanding from '@/domain/membership/MembershipLanding';

// [LC-3294] 마케팅 취준 올인원 패스 랜딩 메타데이터.
// 상품이 바뀌면 이 문장도 함께 고친다 — 검색결과·공유 카드에 그대로 나가는 문구다.
export const metadata: Metadata = {
  title: '마케팅 취준 올인원 패스 | 챌린지·가이드북·멘토링 10주 패스',
  description:
    '마케팅 취준, 현재 준비 수준을 진단하고 경험 정리부터 서류·면접까지 한번에. 챌린지 10종·가이드북 7종·현직자 VOD·1:1 멘토링을 하나의 패스로.',
};

// 글로벌 헤더·푸터(ConditionalLayout)는 유지하고, 멤버십 랜딩을 본 웹앱에 직접 마운트한다.
export default function Page() {
  return <MembershipLanding />;
}
