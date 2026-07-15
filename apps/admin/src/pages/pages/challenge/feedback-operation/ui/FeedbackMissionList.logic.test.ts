import { describe, expect, it } from 'vitest';

import { getFeedbackDeadlineLabel } from './FeedbackMissionList';

/**
 * 피드백 관리 목록(FeedbackMissionList)의 피드백 마감기간 파생 로직 회귀 검증.
 * 실제 프로덕션 함수(getFeedbackDeadlineLabel)를 직접 import 해 검증한다.
 *
 * ※ 실제 화면의 미션명 "공백/`-`" 회귀가 완전히 해소되는지는
 *    Push 1(PR #2442) 병합 + 과거 title='' 데이터 백필(2.2 메모)에 의존한다.
 *    (여기서는 날짜 파생 로직이 정상 동작함만 보장한다.)
 */
describe('getFeedbackDeadlineLabel — 피드백 마감기간(미션 종료일 +3일)', () => {
  it('미션 종료일 + 3일을 반환한다', () => {
    expect(getFeedbackDeadlineLabel('2026-06-01T00:00:00')).toBe(
      '2026년 6월 4일',
    );
  });

  it('월말 종료일도 +3일이 정상 롤오버된다', () => {
    expect(getFeedbackDeadlineLabel('2026-06-29T00:00:00')).toBe(
      '2026년 7월 2일',
    );
  });

  it('종료일이 없으면 - 를 반환한다', () => {
    expect(getFeedbackDeadlineLabel(null)).toBe('-');
    expect(getFeedbackDeadlineLabel(undefined)).toBe('-');
  });
});
