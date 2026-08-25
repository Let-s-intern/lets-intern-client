'use client';

// 하반기 멤버십 랜딩을 본 웹앱에 직접 마운트한다(기존 iframe 임베드 대체).
// 별도 레포(letscareer-membership-landing)의 App.tsx + main.tsx 역할을 합친 진입점으로,
// 섹션/ui/data/lib 은 원본을 그대로 복사했고 전역 CSS 만 .membership-root 하위로 스코핑했다.
// 'use client' 를 여기서 한 번 선언하면 아래 import 되는 섹션·ui 가 모두 클라이언트 번들에 포함된다.

// 섹션별 스타일 — 원본 main.tsx 의 import 순서를 그대로 유지(cascade 보존).
import './styles/base.css';
import './styles/nav.css';
import './styles/hero.css';
// 얼리버드 배너·VOD 훅·추천 대상 — LC-3219 시안에서 빠진 섹션이다(아래 렌더 주석 참조).
// import './styles/early-bird.css';
// import './styles/vod-hook.css';
// import './styles/recommend.css';
import './styles/compare.css';
import './styles/challenge-schedule.css';
import './styles/solution.css';
import './styles/course-plan.css';
// 세미나 — LC-3219 시안에서 빠진 섹션이다(아래 렌더 주석 참조).
// import './styles/seminar.css';
import './styles/benefits.css';
import './styles/benefit-modal.css';
import './styles/proof.css';
import './styles/plan-single.css';
import './styles/community-chat.css';
import './styles/mentoring-coupon.css';
import './styles/reviews.css';
import './styles/roadmap.css';
// 최종 CTA — LC-3219 시안에서 빠진 섹션이다(아래 렌더 주석 참조).
// import './styles/final-cta.css';
import './styles/faq.css';
import './styles/footer.css';
import './styles/animations.css';
import './styles/responsive.css';
// 제휴 혜택 — LC-3219 시안에서 빠진 섹션이다(아래 렌더 주석 참조).
// import './styles/partners.css';
import './styles/apply.css';

import MembershipAnimations from './ui/MembershipAnimations';
import MembershipNav from './ui/MembershipNav';
import HeroSection from './section/HeroSection';
import CompareSection from './section/CompareSection';
import ChallengeScheduleSection from './section/ChallengeScheduleSection';
import SolutionSection from './section/SolutionSection';
import CoursePlanSection from './section/CoursePlanSection';
import BenefitsSection from './section/BenefitsSection';
import PlansSection from './section/PlansSection';
import CommunityChatSection from './section/CommunityChatSection';
import MentoringCouponSection from './section/MentoringCouponSection';
import ReviewsSection from './section/ReviewsSection';
import RoadmapSection from './section/RoadmapSection';
import FaqSection from './section/FaqSection';
import ApplyBar from './ui/ApplyBar';
import MembershipPaymentSheet from './ui/MembershipPaymentSheet';

export default function MembershipLanding() {
  return (
    <>
      <div className="membership-root">
        <main>
          <MembershipAnimations />
          <HeroSection />
          <MembershipNav />
          {/* 공채 로드맵(시안 1.png 하단) — 이 한 줄과 위 import 를 지우면 섹션이 빠진다 */}
          <RoadmapSection />
          {/* 아래 순서는 시안 파일 번호를 그대로 따른다. 바꾸려면 시안부터 확인할 것.
              2.png 패스 구성 → 3.png 가격 플랜 → 4.png 비교 → 5.png 챌린지 일정
              → 6-0/6-1 혜택 헤더+플레이북 → 7-x 혜택 상세 → 8-0 후기 */}
          <SolutionSection />
          <PlansSection />
          <CompareSection />
          <ChallengeScheduleSection />
          {/* CoursePlanSection 이 시안 6-0 헤더까지 렌더한다. BenefitsSection 과 붙어 있어야
              헤더-본문 순서가 맞으므로 둘 사이에 다른 섹션을 넣지 마라. */}
          <CoursePlanSection />
          <BenefitsSection />
          {/* 커뮤니티 톡방 혜택 — 쿠폰 바로 위 */}
          <CommunityChatSection />
          {/* 1:1 멘토링·커피챗 할인 쿠폰 — 후기 바로 위 */}
          <MentoringCouponSection />
          <ReviewsSection />
          {/* LC-3219 시안에서 빠진 섹션 6개 — 얼리버드 배너 · VOD 훅 · 추천 대상 ·
              세미나 · 제휴 혜택 · 최종 CTA. 시안 0~8 어디에도 없다.
              세미나·제휴 혜택은 앵커 네비 항목(ui/MembershipNav.tsx 의 NAV_ITEMS)에서도 함께
              뺐으니 되살릴 때 둘을 같이 되돌려야 한다.
              되살리려면 위 컴포넌트 import 와 CSS import 를 함께 푼다. 파일은 지우지 않았다 —
              section/{EarlyBirdBanner,VodHookSection,RecommendSection,SeminarSection,
              PartnerBenefitsSection,FinalCtaSection}.tsx 와 대응 data/*.ts */}
          <FaqSection />
          <ApplyBar />
        </main>
      </div>
      {/* 결제 컨트롤러는 앱 자체 Tailwind 컴포넌트(PricePlanBottomSheet)를 쓰므로
          .membership-root 스코프 밖에 마운트한다(스코핑/포털 이슈 없음). */}
      <MembershipPaymentSheet />
    </>
  );
}
