import { SEMINAR_SESSIONS } from './seminar';

describe('seminar 데이터 무결성', () => {
  it('세션은 2개다(SESSION 01·02)', () => {
    expect(SEMINAR_SESSIONS).toHaveLength(2);
  });

  it('모든 세션은 hero 이미지·일시·제목·멘토·신청 링크를 가진다', () => {
    for (const session of SEMINAR_SESSIONS) {
      expect(session.heroImage).toMatch(/^\/images\/membership\//);
      expect(session.heroAlt.length).toBeGreaterThan(0);
      expect(session.date.length).toBeGreaterThan(0);
      expect(session.time.length).toBeGreaterThan(0);
      expect(session.title.length).toBeGreaterThan(0);
      expect(session.mentor.name.length).toBeGreaterThan(0);
      expect(session.mentor.role.length).toBeGreaterThan(0);
      expect(session.mentor.profile.length).toBeGreaterThan(0);
    }
  });

  it('각 세션 커리큘럼은 4종이며 번호·주제·시간을 가진다', () => {
    for (const session of SEMINAR_SESSIONS) {
      expect(session.agenda).toHaveLength(4);
      for (const item of session.agenda) {
        expect(item.no.length).toBeGreaterThan(0);
        expect(item.title.length).toBeGreaterThan(0);
        expect(item.duration).toMatch(/분$/);
      }
    }
  });

  it('confirmed 신청 링크는 실제 program/live URL 이다', () => {
    for (const session of SEMINAR_SESSIONS) {
      expect(session.ctaHref).toMatch(
        /^https:\/\/www\.letscareer\.co\.kr\/program\/live\/\d+\//,
      );
    }
  });

  it('두 번째 세션만 VOD 경고를 가진다', () => {
    expect(SEMINAR_SESSIONS[0].notice).toBeUndefined();
    expect(SEMINAR_SESSIONS[1].notice).toMatch(/VOD/);
  });
});
