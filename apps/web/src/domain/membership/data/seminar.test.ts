import { SEMINAR_SESSIONS, type SeminarSession } from './seminar';

const findByStatus = (status: SeminarSession['status']) =>
  SEMINAR_SESSIONS.filter((session) => session.status === status);

describe('seminar 데이터 무결성', () => {
  it('세션은 2개다(LIVE 01·02)', () => {
    expect(SEMINAR_SESSIONS).toHaveLength(2);
  });

  it('status 는 confirmed/tba 둘 다 하나씩 존재한다', () => {
    expect(findByStatus('confirmed')).toHaveLength(1);
    expect(findByStatus('tba')).toHaveLength(1);
  });

  it('모든 세션은 sessionNo 와 ctaLabel 을 가진다', () => {
    for (const session of SEMINAR_SESSIONS) {
      expect(session.sessionNo.length).toBeGreaterThan(0);
      expect(session.ctaLabel.length).toBeGreaterThan(0);
    }
  });

  describe('confirmed 세션 가드', () => {
    it('date·time·topic·mentor 가 모두 채워져 있다', () => {
      for (const session of findByStatus('confirmed')) {
        expect(session.date).toBeTruthy();
        expect(session.time).toBeTruthy();
        expect(session.topic).toBeTruthy();
        expect(session.mentor?.name).toBeTruthy();
        expect(session.mentor?.profile).toBeTruthy();
      }
    });
  });

  describe('tba 세션 가드', () => {
    it('time·topic·mentor 미정(생략)을 허용한다', () => {
      for (const session of findByStatus('tba')) {
        expect(session.time).toBeUndefined();
        expect(session.topic).toBeUndefined();
        expect(session.mentor).toBeUndefined();
      }
    });
  });

  it('신청 링크 미확정 시 ctaHref 는 생략된다(비활성 CTA)', () => {
    for (const session of SEMINAR_SESSIONS) {
      if (session.ctaHref !== undefined) {
        expect(session.ctaHref.length).toBeGreaterThan(0);
      }
    }
  });
});
