import Image from 'next/image';
import Link from 'next/link';

/**
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │ [PROMO-BANNER] 하반기 멤버십 프로모션 배너 (한시적)                    │
 * │                                                                       │
 * │ 프로모션 종료 시 삭제 방법 — `grep -rn "\[PROMO-BANNER\]"` 로 전부 찾기│
 * │   1. 이 파일(MembershipPromoBanner.tsx) 삭제                          │
 * │   2. TopBanner.tsx 의 import 와 <MembershipPromoBanner /> 렌더 줄 제거 │
 * │   3. public/images/home-membership-banner.png 삭제                     │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * TopBanner(상단 띠 배너) 안에서 밴드 바로 아래에 렌더되며, 클릭 시 /membership 으로 이동한다.
 * 음수 마진(-mt)으로 고정 밴드 아래에 살짝 겹쳐 올려, 밴드가 이미지 상단(배경 영역)을 덮게 한다.
 * → 스페이서와 실제 밴드 높이 차이로 생기던 흰 틈을 브레이크포인트 무관하게 제거.
 * 와이드(4:1) 이미지라 모바일에서는 글자가 뭉개져 md 이상에서만 노출한다.
 *
 * 이미지는 3840x960 이다. 표시 최대폭이 1920 CSS px 이라 2배면 충분하다.
 * 교체할 때 width/height 를 새 비율에 맞추지 않으면 레이아웃 시프트가 생긴다.
 */
const MembershipPromoBanner = () => {
  return (
    <Link
      href="/membership"
      className="relative hidden w-full overflow-hidden md:-mt-2 md:block"
      aria-label="2026 하반기 멤버십 - 공채 준비 올인원 패스 안내"
    >
      <Image
        src="/images/home-membership-banner.png"
        alt="챌린지 2개보다 저렴한 가격으로, 하반기 공채 준비를 한번에. 26 합격 패스 184,000원, 정가 대비 82% 이상 혜택, 구매 즉시부터 2026년 11월 30일까지 이용 가능. 챌린지 10종, 가이드북 6종, 13주 플레이북, VOD 20여종, 1:1 멘토링 할인권, 렛츠커리어 커뮤니티 포함. 혜택 자세히 보기"
        width={3840}
        height={960}
        className="h-auto w-full"
        sizes="100vw"
        priority
      />
    </Link>
  );
};

export default MembershipPromoBanner;
