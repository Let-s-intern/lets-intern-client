// posthog-js 를 목으로 바꿔 이벤트 이름·속성만 본다.
// 목 형태는 `domain/blog/ad/captureExperimentEvent.test.ts` 와 같다.
const mockCapture = jest.fn();
const posthogMock = {
  capture: (...args: unknown[]) => mockCapture(...args),
  __loaded: true as boolean,
};
jest.mock('posthog-js', () => ({
  __esModule: true,
  get default() {
    return posthogMock;
  },
}));

import { CHECKUP_QUESTIONS, resolveCheckupResult } from './data/checkup';
import {
  captureBenefitModalOpened,
  captureCheckupAnswered,
  captureCheckupCompleted,
  captureCheckupResultCtaClicked,
  captureCheckupStarted,
  capturePaymentCtaClicked,
  capturePrepStepExpanded,
  MEMBERSHIP_EVENTS,
} from './analytics';

beforeEach(() => {
  mockCapture.mockClear();
  posthogMock.__loaded = true;
});

describe('이벤트 이름과 속성', () => {
  it('진단 시작은 속성 없이 보낸다', () => {
    captureCheckupStarted();

    expect(mockCapture).toHaveBeenCalledWith(
      'membership_checkup_started',
      undefined,
    );
  });

  it('문항 답변은 문항 번호 · 영역 · 선택지 순번 · 배점을 보낸다', () => {
    captureCheckupAnswered({ question: CHECKUP_QUESTIONS[2], optionIndex: 1 });

    expect(mockCapture).toHaveBeenCalledWith('membership_checkup_answered', {
      question_no: '03',
      area_id: 'experience',
      option_index: 1,
      // Q3 ② 배점이다. 문항 데이터에서 읽는다
      score: 38,
    });
  });

  /* 답변 글이 그대로 실려 나가면 답을 저장하지 않는다는 결정(PRD Q2)이 무의미해진다. */
  it('문항 답변에 선택지 글이 실리지 않는다', () => {
    captureCheckupAnswered({ question: CHECKUP_QUESTIONS[0], optionIndex: 0 });

    const properties = JSON.stringify(mockCapture.mock.calls[0][1]);
    expect(properties).not.toContain(CHECKUP_QUESTIONS[0].options[0]);
    expect(properties).not.toContain(CHECKUP_QUESTIONS[0].question);
  });

  it('진단 완료는 CASE 와 축 점수를 펼쳐 보낸다', () => {
    const result = resolveCheckupResult([0, 3, 3, 3, 3]);
    if (!result) throw new Error('결과가 나와야 한다');

    captureCheckupCompleted(result);

    expect(mockCapture).toHaveBeenCalledWith('membership_checkup_completed', {
      case_id: 'A',
      score_direction: 15,
      score_experience: 95,
      score_document: 95,
      score_apply: 95,
    });
  });

  it('결과 CTA 클릭은 CASE 를 보낸다', () => {
    captureCheckupResultCtaClicked({ caseId: 'C' });

    expect(mockCapture).toHaveBeenCalledWith(
      'membership_checkup_result_cta_clicked',
      { case_id: 'C' },
    );
  });

  /* CASE E 자리의 버튼만 문구가 다르다. 대시보드에서 그 버튼만 세려면 속성이 있어야 한다 */
  it('CASE E 멘토링 CTA 는 cta 속성을 함께 보낸다', () => {
    captureCheckupResultCtaClicked({ caseId: 'E', cta: 'mentoring' });

    expect(mockCapture).toHaveBeenCalledWith(
      'membership_checkup_result_cta_clicked',
      { case_id: 'E', cta: 'mentoring' },
    );
  });

  it('단계 카드 펼치기는 STEP 을 보낸다', () => {
    capturePrepStepExpanded({ stepId: 'step-02' });

    expect(mockCapture).toHaveBeenCalledWith('membership_prep_step_expanded', {
      step_id: 'step-02',
    });
  });

  it('혜택 모달 열기는 혜택 종류를 보낸다', () => {
    captureBenefitModalOpened({ benefitId: 'guidebook' });

    expect(mockCapture).toHaveBeenCalledWith(
      'membership_benefit_modal_opened',
      {
        benefit_id: 'guidebook',
      },
    );
  });

  it('결제 CTA 클릭은 어느 자리인지 보낸다', () => {
    capturePaymentCtaClicked({ location: 'apply_bar' });

    expect(mockCapture).toHaveBeenCalledWith('membership_payment_cta_clicked', {
      location: 'apply_bar',
    });
  });

  /* 이름은 대시보드와 맞춰야 하는 계약이라 상수도 함께 못박는다. */
  it('이벤트 이름 7종이 상수와 같다', () => {
    expect(Object.values(MEMBERSHIP_EVENTS)).toEqual([
      'membership_checkup_started',
      'membership_checkup_answered',
      'membership_checkup_completed',
      'membership_checkup_result_cta_clicked',
      'membership_prep_step_expanded',
      'membership_benefit_modal_opened',
      'membership_payment_cta_clicked',
    ]);
  });
});

describe('실패를 흡수한다', () => {
  it('SDK 미초기화면 capture 를 부르지 않는다', () => {
    posthogMock.__loaded = false;

    captureCheckupStarted();
    capturePaymentCtaClicked({ location: 'hero' });

    expect(mockCapture).not.toHaveBeenCalled();
  });

  /* 광고 차단기가 capture 를 덮어써 예외가 나도 버튼은 그대로 동작해야 한다. */
  it('capture 가 던져도 함수가 던지지 않는다', () => {
    mockCapture.mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(() => captureCheckupStarted()).not.toThrow();
    expect(() =>
      captureCheckupAnswered({
        question: CHECKUP_QUESTIONS[0],
        optionIndex: 0,
      }),
    ).not.toThrow();
    expect(() => capturePrepStepExpanded({ stepId: 'step-01' })).not.toThrow();
    expect(() => captureBenefitModalOpened({ benefitId: 'vod' })).not.toThrow();
    expect(() =>
      capturePaymentCtaClicked({ location: 'pricing' }),
    ).not.toThrow();

    mockCapture.mockReset();
  });
});
