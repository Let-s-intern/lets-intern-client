import {
  CHALLENGE_SCHEDULE,
  GANTT_ALT,
  GANTT_SIZE,
  GANTT_SRC,
} from './challengeSchedule';

describe('challengeSchedule 데이터 무결성', () => {
  it('GANTT_ALT 는 이름표가 아니라 문장이다(30자 이상)', () => {
    expect(GANTT_ALT.length).toBeGreaterThan(30);
  });

  it('GANTT_ALT 는 간트 4행의 이름을 모두 포함한다', () => {
    for (const row of [
      '경험 정리',
      '서류 완성',
      '실전 공채 서류 완성',
      '인적성 면접',
    ]) {
      expect(GANTT_ALT).toContain(row);
    }
  });

  it('GANTT_ALT 는 행별 챌린지명과 주차를 담는다', () => {
    expect(GANTT_ALT).toContain('기필코 경험정리 챌린지 30기');
    expect(GANTT_ALT).toContain('포트폴리오 1주 완성 39기');
    expect(GANTT_ALT).toContain('HR 직무 서류 완성 올인원 4기');
    expect(GANTT_ALT).toContain('면접 준비 끝장 챌린지 8기');
    expect(GANTT_ALT).toContain('8월 24일');
    expect(GANTT_ALT).toContain('10월 5일');
  });

  it('간트 패널이 WebP 이고 크기가 함께 기록돼 있다', () => {
    // 크기를 기록해 두는 이유는 CLS 다 — next/image 를 쓰지 않아 자동 예약이 없다.
    expect(GANTT_SRC).toBe('/images/membership/gantt-panel.webp');
    expect(GANTT_SIZE.width).toBeGreaterThan(0);
    expect(GANTT_SIZE.height).toBeGreaterThan(0);
    // PNG·JPG 반입 금지
    expect(GANTT_SRC.endsWith('.webp')).toBe(true);
  });

  it('이용 기간 날짜는 상수로 두지 않는다(endDate 에서 포맷)', () => {
    const texts = Object.values(CHALLENGE_SCHEDULE).join(' ');
    expect(texts).not.toContain('11월 30일');
    expect(texts).not.toContain('11/30');
  });

  it('헤더와 안내 박스 문구가 모두 채워져 있다', () => {
    expect(CHALLENGE_SCHEDULE.title.length).toBeGreaterThan(0);
    expect(CHALLENGE_SCHEDULE.subtitle.length).toBeGreaterThan(0);
    expect(CHALLENGE_SCHEDULE.noticeLead.length).toBeGreaterThan(0);
    expect(CHALLENGE_SCHEDULE.noticeHighlightSuffix).toMatch(/신청가능/);
    expect(CHALLENGE_SCHEDULE.noticeDescription.length).toBeGreaterThan(0);
    expect(CHALLENGE_SCHEDULE.periodLabel).toBe('이용 가능 기간');
  });
});
