import { Metadata } from 'next';
import MembershipLanding from '@/domain/membership-legacy/MembershipLanding';

// [LC-3294] 하반기 공채 멤버십(구버전) 랜딩.
//
// 상세페이지 자리는 마케팅 취준 올인원 패스(`/membership-marketing`)가 가져갔지만, 이
// 주소는 살려 둔다. 이미 결제한 사람이 자기가 산 상품 설명을 다시 볼 수 있어야 하고,
// 광고·메일·커뮤니티에 뿌려진 `/membership` 링크가 404 로 떨어지면 안 된다.
//
// GNB 에는 걸지 않는다. 새로 들어온 사람에게 파는 상품은 마케팅 패스 하나다.
//
// [LC-3219-MEMBERSHIP] 시즌 표기(9~11월)가 들어 있으므로 상품을 내릴 때 함께 고친다.
export const metadata: Metadata = {
  title: '렛츠커리어 하반기 멤버십 | 자소서·인적성·면접 3개월 패스',
  description:
    '9~11월 하반기 공채 시즌, 가이드북·챌린지·VOD·멘토링을 하나의 멤버십으로.',
};

// 글로벌 헤더·푸터(ConditionalLayout)는 유지하고, 멤버십 랜딩을 본 웹앱에 직접 마운트한다.
export default function Page() {
  return <MembershipLanding />;
}
