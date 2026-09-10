'use client';

// 마케팅 취준 올인원 패스 랜딩 (LC-3294).
//
// **섹션 순서는 시안 1~15 를 그대로 따른다.** 시안은 선택지가 아니라 위에서 아래로
// 이어지는 한 장의 상세페이지다. 순서를 바꾸거나 중간에 다른 섹션을 끼우려면 시안부터
// 확인할 것.
//
// 시안에 없는 기존 섹션(챌린지 일정·커뮤니티 톡방·후기·얼리버드·제휴 혜택·최종 CTA·
// VOD 훅)은 렌더하지 않는다. 파일은 지우지 않았다 — 다음 시즌에 되살릴 수 있다.
// 되살리려면 해당 import 와 CSS import 를 함께 푼다.
//
// FAQ 는 시안에 없지만 남긴다. 어드민 챌린지에 등록한 FAQ 를 그대로 보여주는 자리이고
// (`lib/useMembershipChallengeData`), 운영이 상품 문의를 여기서 답한다.

// 레거시 섹션별 스타일 — 아직 쓰는 섹션(히어로·플레이북·FAQ·하단 신청바)만 남긴다.
import './styles/base.css';
import './styles/nav.css';
import './styles/hero.css';
import './styles/course-plan.css';
import './styles/faq.css';
import './styles/footer.css';
import './styles/animations.css';
import './styles/responsive.css';
import './styles/apply.css';

import MembershipAnimations from './ui/MembershipAnimations';
import MembershipNav from './ui/MembershipNav';
import HeroSection from './section/HeroSection';
import RecommendSection from './section/RecommendSection';
import JobMarketSection from './section/JobMarketSection';
import RoadmapSection from './section/RoadmapSection';
import SolutionSection from './section/SolutionSection';
import PassBenefitsSection from './section/PassBenefitsSection';
import PathMatchSection from './section/PathMatchSection';
import CoursePlanSection from './section/CoursePlanSection';
import PlaybookDashboardSection from './section/PlaybookDashboardSection';
import ChallengeListSection from './section/ChallengeListSection';
import GuidebookListSection from './section/GuidebookListSection';
import MarketerVodSection from './section/MarketerVodSection';
import SpecialLiveSection from './section/SpecialLiveSection';
import MentoringCouponSection from './section/MentoringCouponSection';
import CompareSection from './section/CompareSection';
import PlansSection from './section/PlansSection';
import FaqSection from './section/FaqSection';
import ApplyBar from './ui/ApplyBar';
import MembershipPaymentSheet from './ui/MembershipPaymentSheet';

export default function MembershipLanding() {
  return (
    <>
      <div className="membership-root">
        <main>
          <MembershipAnimations />

          {/* 시안 1 — 히어로 */}
          <HeroSection />
          <MembershipNav />

          {/* 시안 2 — 고민 3카드 (WHERE DO I START?) */}
          <RecommendSection />

          {/* 시안 3 — 채용공고 예시 + 카피 (WHY NOW) */}
          <JobMarketSection />

          {/* 시안 4 — STEP 01~05 (START WITH A DRAFT) */}
          <RoadmapSection />

          {/* 시안 5 — 결과물 3카드 + 하단 밴드 (YOUR JOB ROADMAP) */}
          <SolutionSection />

          {/* 시안 6 — 혜택 7카드 (PASS BENEFITS) */}
          <PassBenefitsSection />

          {/* 시안 7 — 상황별 프로그램 매칭 (FIND YOUR PATH) */}
          <PathMatchSection />

          {/* 시안 8 — 10주 합격 플레이북 매트릭스 */}
          <CoursePlanSection />

          {/* 시안 9 — 플레이북 대시보드 목업 */}
          <PlaybookDashboardSection />

          {/* 시안 10 — 챌린지 10종 */}
          <ChallengeListSection />

          {/* 시안 11 — 가이드북 7종 */}
          <GuidebookListSection />

          {/* 시안 12 — 현직자 VOD */}
          <MarketerVodSection />

          {/* 시안 13 — 쥬디 LIVE 클리닉 + 특별 세미나 */}
          <SpecialLiveSection />

          {/* 시안 14 — 1:1 멘토링 50% 쿠폰 */}
          <MentoringCouponSection />

          {/* 시안 15 — 가격 비교표 + 단일 플랜 카드 */}
          <CompareSection />
          <PlansSection />

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
