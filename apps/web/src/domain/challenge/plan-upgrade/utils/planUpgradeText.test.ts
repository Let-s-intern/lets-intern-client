import {
  formatAdditionalAmount,
  formatDeadline,
  formatFeedbackCount,
  formatFeedbackMission,
  formatUpgradeCta,
  unavailableReasonText,
} from './planUpgradeText';

describe('planUpgradeText', () => {
  it('추가 금액은 + 부호와 천 단위 구분을 붙인다', () => {
    expect(formatAdditionalAmount(85000)).toBe('+85,000원');
  });

  it('하단 버튼 문구에 금액을 넣는다', () => {
    expect(formatUpgradeCta(169000)).toBe('169,000원에 업그레이드 하기');
  });

  it('서면 피드백 미션 줄', () => {
    expect(
      formatFeedbackMission({
        th: 3,
        title: '경험분석',
        feedbackType: 'WRITTEN_FEEDBACK',
      }),
    ).toBe('3회차 미션 경험분석 서면 멘토링');
  });

  it('Live 피드백 미션 줄', () => {
    expect(
      formatFeedbackMission({
        th: 3,
        title: '경험분석',
        feedbackType: 'LIVE_FEEDBACK',
      }),
    ).toBe('3회차 미션 경험분석 Live 멘토링');
  });

  it('피드백 횟수 제목', () => {
    expect(formatFeedbackCount(4)).toBe('피드백 4회');
  });

  it('마감 시각은 M월 D일 HH:mm 이다', () => {
    expect(formatDeadline('2026-10-01T09:05:00')).toBe('10월 1일 09:05');
  });
});

describe('unavailableReasonText', () => {
  it.each([
    ['CANCELED', '취소된 신청은 플랜을 업그레이드할 수 없어요'],
    ['PARTIALLY_REFUNDED', '환불된 신청은 플랜을 업그레이드할 수 없어요'],
    ['LIGHT', '라이트 플랜은 업그레이드할 수 없어요'],
    ['TOP_PLAN', '이미 가장 높은 플랜을 이용 중이에요'],
    ['ALREADY_CHANGED', '플랜은 한 번만 변경할 수 있어요'],
  ] as const)('%s 문구', (reason, text) => {
    expect(unavailableReasonText(reason, '2026-10-01T23:59:59')).toBe(text);
  });

  it('DEADLINE_PASSED 는 마감 시각을 괄호로 붙인다', () => {
    expect(
      unavailableReasonText('DEADLINE_PASSED', '2026-10-01T23:59:59'),
    ).toBe('업그레이드 가능 기간이 지났어요 (10월 1일 23:59까지)');
  });

  it('DEADLINE_PASSED 인데 마감 시각이 없으면 괄호를 뺀다', () => {
    expect(unavailableReasonText('DEADLINE_PASSED', null)).toBe(
      '업그레이드 가능 기간이 지났어요',
    );
  });
});
