'use client';

// 하반기 멤버십 랜딩을 본 웹앱에 직접 마운트한다(기존 iframe 임베드 대체).
// 별도 레포(letscareer-membership-landing)의 App.tsx + main.tsx 역할을 합친 진입점으로,
// 섹션/ui/data/lib 은 원본을 그대로 복사했고 전역 CSS 만 .membership-root 하위로 스코핑했다.
// 'use client' 를 여기서 한 번 선언하면 아래 import 되는 섹션·ui 가 모두 클라이언트 번들에 포함된다.

// 섹션별 스타일 — 원본 main.tsx 의 import 순서를 그대로 유지(cascade 보존).
import './styles/base.css';
import './styles/nav.css';
import './styles/hero.css';
import './styles/solution.css';
import './styles/course-plan.css';
import './styles/seminar.css';
import './styles/benefits.css';
import './styles/benefit-modal.css';
import './styles/proof.css';
import './styles/plan-single.css';
import './styles/reviews.css';
import './styles/roadmap.css';
import './styles/final-cta.css';
import './styles/faq.css';
import './styles/footer.css';
import './styles/animations.css';
import './styles/responsive.css';
import './styles/partners.css';
import './styles/apply.css';

import MembershipAnimations from './ui/MembershipAnimations';
import HeroSection from './section/HeroSection';
import SolutionSection from './section/SolutionSection';
import CoursePlanSection from './section/CoursePlanSection';
import SeminarSection from './section/SeminarSection';
import BenefitsSection from './section/BenefitsSection';
import PartnerBenefitsSection from './section/PartnerBenefitsSection';
import PlansSection from './section/PlansSection';
import ReviewsSection from './section/ReviewsSection';
import RoadmapSection from './section/RoadmapSection';
import FinalCtaSection from './section/FinalCtaSection';
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
          <SolutionSection />
          <CoursePlanSection />
          <SeminarSection />
          <BenefitsSection />
          <PartnerBenefitsSection />
          <PlansSection />
          <ReviewsSection />
          <RoadmapSection />
          <FinalCtaSection />
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
