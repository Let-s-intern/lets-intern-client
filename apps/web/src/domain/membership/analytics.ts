// 마케팅 올인원 패스 랜딩의 PostHog 이벤트 (PRD 4.13).
//
// **이 도메인의 이벤트 이름은 여기가 유일한 출처다.** 컴포넌트에서 `posthog` 를 직접
// 부르지 않는다 — 이름이 여러 파일에 흩어지면 대시보드에서 집계되는 이름이 갈린다.
//
// 이름·속성 규칙은 `domain/seminar/analytics.ts` · `domain/blog/ad/experiment.ts` 를
// 그대로 따랐다. 이벤트는 `{도메인}_{대상}_{과거형 동사}`, 속성은 snake_case 다.
// 새 규칙을 만들지 않는다.
//
// **답변 내용은 보내지 않는다.** 선택지 순번·배점·영역 id 만 보낸다(PRD 결정 Q2).
// 이름·이메일 같은 개인을 알아볼 수 있는 값은 어느 이벤트에도 넣지 않는다.
//
// (Vercel: 직접 import — 배럴 파일 금지)

import posthog from 'posthog-js';

import type {
  CheckupCaseId,
  CheckupQuestion,
  CheckupResult,
} from './data/checkup';

/** PostHog 대시보드에서 집계되는 이름. 대시보드 설정과 1:1 로 맞아야 하는 "계약" 이다. */
export const MEMBERSHIP_EVENTS = {
  checkupStarted: 'membership_checkup_started',
  checkupAnswered: 'membership_checkup_answered',
  checkupCompleted: 'membership_checkup_completed',
  checkupResultCtaClicked: 'membership_checkup_result_cta_clicked',
  prepStepExpanded: 'membership_prep_step_expanded',
  benefitModalOpened: 'membership_benefit_modal_opened',
  paymentCtaClicked: 'membership_payment_cta_clicked',
} as const;

/** 결제 CTA 가 놓인 자리. 같은 결제 흐름을 어느 자리에서 눌렀는지 구분한다. */
export type MembershipPaymentCtaLocation =
  | 'hero'
  | 'pricing'
  | 'final_cta'
  | 'apply_bar';

/**
 * 공통 capture 헬퍼.
 *
 * - SDK 미초기화(env 미설정·SSR) 시 `posthog.__loaded` 가 falsy → no-op.
 *   `domain/seminar/analytics.ts` 와 같은 가드다.
 * - 그 위에 try/catch 를 더 둔다. 광고 차단기가 `capture` 를 덮어쓰거나 전송이 막혀
 *   예외가 나도 **버튼 동작은 그대로여야 한다** — 이벤트는 화면 동작의 전제가 아니다.
 *   집계가 실제보다 적게 잡히는 것은 PRD 4.13 이 전제로 받아들인 값이다.
 */
function capture(
  event: (typeof MEMBERSHIP_EVENTS)[keyof typeof MEMBERSHIP_EVENTS],
  properties?: Record<string, unknown>,
): void {
  try {
    if (!posthog.__loaded) return;
    posthog.capture(event, properties);
  } catch {
    // 무시한다. 위 주석 참고.
  }
}

/** 진단 시작 — 첫 문항에 답할 때 한 번. 부르는 쪽이 "첫 답" 판단을 한다. */
export function captureCheckupStarted(): void {
  capture(MEMBERSHIP_EVENTS.checkupStarted);
}

/**
 * 문항 답변 — 문항마다.
 *
 * 고른 선택지의 **글이 아니라 순번**을 보낸다. 배점은 문항 데이터에서 읽어 함께
 * 담는다 — 배점표를 조정하면 대시보드의 과거 이벤트와 값이 달라지므로, 그때의 점수를
 * 이벤트에 남겨야 비교가 된다.
 */
export function captureCheckupAnswered(params: {
  question: CheckupQuestion;
  optionIndex: number;
}): void {
  capture(MEMBERSHIP_EVENTS.checkupAnswered, {
    question_no: params.question.no,
    area_id: params.question.areaId,
    option_index: params.optionIndex,
    score: params.question.scores[params.optionIndex],
  });
}

/**
 * 진단 완료 — 결과가 나올 때.
 *
 * 축 점수(0~100)는 `score_{영역 id}` 로 펼쳐 담는다. 중첩 객체로 보내면 PostHog 에서
 * 축 하나를 기준으로 거르거나 평균 내기 어렵다.
 */
export function captureCheckupCompleted(result: CheckupResult): void {
  const scores: Record<string, number> = {};
  for (const score of result.scores) {
    scores[`score_${score.area.id}`] = score.score;
  }

  capture(MEMBERSHIP_EVENTS.checkupCompleted, {
    case_id: result.caseId,
    ...scores,
  });
}

/** 결과 CTA 클릭 — "준비 단계 확인하기". */
export function captureCheckupResultCtaClicked(params: {
  caseId: CheckupCaseId;
}): void {
  capture(MEMBERSHIP_EVENTS.checkupResultCtaClicked, {
    case_id: params.caseId,
  });
}

/** 단계 카드 펼치기 — "혼자하기 어렵다면?". 접을 때는 부르지 않는다. */
export function capturePrepStepExpanded(params: { stepId: string }): void {
  capture(MEMBERSHIP_EVENTS.prepStepExpanded, { step_id: params.stepId });
}

/** 혜택 모달 열기 — "자세히 보기". 어느 혜택인지 담는다. */
export function captureBenefitModalOpened(params: { benefitId: string }): void {
  capture(MEMBERSHIP_EVENTS.benefitModalOpened, {
    benefit_id: params.benefitId,
  });
}

/** 결제 CTA 클릭 — 히어로·가격·마지막 CTA·하단 고정 바 네 자리. */
export function capturePaymentCtaClicked(params: {
  location: MembershipPaymentCtaLocation;
}): void {
  capture(MEMBERSHIP_EVENTS.paymentCtaClicked, { location: params.location });
}
