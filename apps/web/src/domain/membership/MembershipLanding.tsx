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
// 개편(마케팅 올인원 패스 랜딩 전면 개편)으로 순서를 PRD 4.14 대로 확정했다. 방문자의
// 막힌 지점을 먼저 진단하고, 그 결과로 준비 단계를 보여준 뒤, 그 단계를 실행하는 수단으로
// 패스를 제시한다. RecommendSection(고민 3카드)은 REAL TALK 이, RoadmapSection(STEP
// 01~05 세로 목록)은 준비 단계 카드가 그 자리를 대신하면서 렌더에서 빠졌다 — 같은
// 관행대로 파일은 남긴다.
//
// 챌린지 10종·가이드북 7종·현직자 VOD·멘토링 쿠폰 네 섹션도 같은 이유로 빠졌다. 내용이
// 패스 소개(PassIntroSection)의 혜택 모달 4개로 들어갔고, **데이터 파일은 그대로 쓴다.**
// 쥬디 클리닉(SpecialLiveSection)은 LiveClinicSection 이 대신한다.
//
// 시안에 자리가 없어진 JobMarketSection·SolutionSection·PassBenefitsSection·
// PathMatchSection 도 렌더에서 뺐다. CompareSection·PlansSection 두 섹션은
// PricingSection 한 장이 대신한다.
// 섹션 id 가 사라지면 그 id 를 가리키던 앵커가 조용히 죽는다 — `data/prepSteps.ts`,
// `data/passBenefitModals.ts`, `section/HeroSection.tsx`, `ui/MembershipNav.tsx` 를
// 함께 고쳤다.
//
// FAQ 는 시안에 없지만 남긴다. 어드민 챌린지에 등록한 FAQ 를 그대로 보여주는 자리이고
// (`lib/useMembershipChallengeData`), 운영이 상품 문의를 여기서 답한다.

// 레거시 섹션별 스타일 — 아직 쓰는 섹션(히어로·플레이북·FAQ·하단 신청바)만 남긴다.
import './styles/base.css';
import './styles/nav.css';
import './styles/hero.css';
import './styles/course-plan.css';
// `plan-single.css`(PlansSection 의 가격 카드)는 그 섹션이 PricingSection 으로 대체되며
// 빠졌다. 섹션을 켜고 끌 때 대응 CSS import 도 함께 확인할 것 — 예전에 이 import 를
// 빠뜨려 카드가 스타일 없이 세로로 쏟아진 적이 있다.
import './styles/faq.css';
import './styles/footer.css';
import './styles/animations.css';
import './styles/responsive.css';
import './styles/apply.css';

import { useEffect, useRef, useState } from 'react';

import type { CheckupAnswers } from './data/checkup';
import {
  CHECKUP,
  CHECKUP_RESULT,
  EMPTY_CHECKUP_ANSWERS,
  resolveCheckupResult,
} from './data/checkup';
import { PREP_STEPS } from './data/prepSteps';
import { scrollToSection } from './lib/scrollToSection';

import MembershipAnimations from './ui/MembershipAnimations';
import MembershipNav from './ui/MembershipNav';
import HeroSection from './section/HeroSection';
import RealTalkSection from './section/RealTalkSection';
import CheckupSection from './section/CheckupSection';
import CheckupResultSection from './section/CheckupResultSection';
import PrepStepsSection from './section/PrepStepsSection';
import PassResultsSection from './section/PassResultsSection';
import PassIntroSection from './section/PassIntroSection';
import LiveClinicSection from './section/LiveClinicSection';
import PlaybookIntroSection from './section/PlaybookIntroSection';
import CoursePlanSection from './section/CoursePlanSection';
import PlaybookDashboardSection from './section/PlaybookDashboardSection';
import PricingSection from './section/PricingSection';
import FinalCtaSection from './section/FinalCtaSection';
import FaqSection from './section/FaqSection';
import ApplyBar from './ui/ApplyBar';
import MembershipPaymentSheet from './ui/MembershipPaymentSheet';

export default function MembershipLanding() {
  /*
   * 진단 답은 여기서 든다. 진단 문항 · 결과 · 준비 단계 세 섹션이 같은 답을 봐야 해서
   * 어느 한 섹션 안에 둘 수 없다. 전역 스토어는 쓰지 않는다 — 이 페이지 밖에서 쓸 일이
   * 없고, 새로고침하면 사라지는 것이 맞는 상태다 (PRD 결정 Q2).
   */
  const [answers, setAnswers] = useState<CheckupAnswers>(EMPTY_CHECKUP_ANSWERS);
  /*
   * "다시 진단하기" 는 답을 비우는 것만으로는 부족하다. 지금 몇 번째 문항인지는
   * CheckupSection 안의 상태라, key 를 바꿔 다시 마운트해 처음 문항으로 되돌린다.
   */
  const [attempt, setAttempt] = useState(0);

  const result = resolveCheckupResult(answers);

  /*
   * 결과는 진단 카드 아래에 나타난다. 마지막 문항을 답한 사람은 카드만 보고 있어
   * 결과가 생긴 줄 모른다. 결과가 처음 나온 순간에만 그 자리로 옮겨 준다 —
   * 앞 문항을 고쳐 결과가 바뀔 때마다 화면이 튀면 답을 고칠 수 없다.
   */
  const hadResult = useRef(false);
  useEffect(() => {
    if (result === null) {
      hadResult.current = false;
      return;
    }
    if (hadResult.current) return;
    hadResult.current = true;
    scrollToSection(CHECKUP_RESULT.anchorId);
  }, [result]);

  const handleRestart = () => {
    setAnswers(EMPTY_CHECKUP_ANSWERS);
    setAttempt((prev) => prev + 1);
    // 처음 문항으로 되돌렸으니 그 문항이 있는 자리로 함께 옮긴다
    scrollToSection(CHECKUP.anchorId);
  };

  return (
    <>
      <div className="membership-root">
        <main>
          <MembershipAnimations />

          {/* 시안 1 — 히어로 */}
          <HeroSection />
          <MembershipNav />

          {/* 개편 시안 1 — REAL TALK 질문 말풍선과 막히는 4지점 */}
          <RealTalkSection />

          {/* 개편 시안 2 — 무료 진단 5문항 (FREE CHECK-UP) */}
          <CheckupSection
            answers={answers}
            key={attempt}
            onAnswersChange={setAnswers}
          />

          {/* 개편 시안 3 — 진단 결과 (CAREER CHECK RESULT) */}
          <CheckupResultSection
            onRestart={handleRestart}
            result={result}
            stepsAnchorId={PREP_STEPS.anchorId}
          />

          {/* 개편 시안 4 — 준비 단계 카드 7장 (FROM PARTICIPANTS).
              기존 RoadmapSection(STEP 01~05 세로 목록) 자리다. */}
          <PrepStepsSection caseId={result?.caseId ?? null} />

          {/* 개편 시안 5 — 합격 사례 (REAL RESULTS) */}
          <PassResultsSection />

          {/* 개편 시안 6 — 패스 소개와 혜택 4카드. 챌린지·가이드북·VOD·멘토링
              네 섹션이 여기 모달로 들어왔다. */}
          <PassIntroSection />

          {/* 개편 시안 7 — 쥬디 멘토 LIVE 클리닉. SpecialLiveSection 자리다. */}
          <LiveClinicSection />

          {/* 개편 시안 8 — 10주 플레이북 인트로. 매트릭스 바로 위 자리다. */}
          <PlaybookIntroSection />

          {/* 개편 시안 9 — 10주 합격 플레이북 매트릭스 */}
          <CoursePlanSection />

          {/* 개편 시안 10 — 실행 흐름·대시보드 목업·주차별 산출물 세 덩어리 */}
          <PlaybookDashboardSection />

          {/* 개편 시안 11 — 가격 비교 두 카드. CompareSection + PlansSection 자리다. */}
          <PricingSection />

          {/* 개편 시안 12 — 마지막 CTA */}
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
