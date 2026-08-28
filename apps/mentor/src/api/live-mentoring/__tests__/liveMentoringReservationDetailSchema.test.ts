import { describe, expect, it } from 'vitest';

import { liveMentoringReservationDetailSchema } from '../liveMentoringSchema';

/**
 * 멘토 예약 상세 응답 계약(PRD 4.1) 검증.
 *
 * 특히 두 가지를 못박는다 — `questionUpdatedAt` 이 없어도 파싱이 통과하는지(PRD 4.5),
 * 동의 미체크 건의 `attachmentUrl` 이 null 로 와도 통과하는지(PRD 4.4).
 */
const DETAIL = {
  applicationId: 91001,
  menteeName: '김일대',
  productName: '자소서 실전 첨삭 멘토링',
  durationMinutes: 60,
  reservationStartAt: '2026-08-30T10:00:00',
  reservationEndAt: '2026-08-30T11:00:00',
  mentoringCategory: 'PERSONAL_STATEMENT',
  questionDeferred: false,
  questionContent: '지원 동기 문단이 약한 것 같습니다.',
  attachmentType: 'URL',
  attachmentUrl: 'https://www.notion.so/mentee-portfolio',
  mentorShareAgreed: true,
};

describe('liveMentoringReservationDetailSchema', () => {
  it('전 필드를 그대로 파싱한다', () => {
    const parsed = liveMentoringReservationDetailSchema.parse({
      ...DETAIL,
      questionUpdatedAt: '2026-08-28T09:00:00',
    });

    expect(parsed.applicationId).toBe(91001);
    expect(parsed.menteeName).toBe('김일대');
    expect(parsed.mentoringCategory).toBe('PERSONAL_STATEMENT');
    expect(parsed.attachmentType).toBe('URL');
    expect(parsed.attachmentUrl).toBe('https://www.notion.so/mentee-portfolio');
    expect(parsed.mentorShareAgreed).toBe(true);
    expect(parsed.questionUpdatedAt).toBe('2026-08-28T09:00:00');
  });

  it('questionUpdatedAt 이 없어도 통과한다 — 백엔드가 이번에 내리지 않는다', () => {
    const parsed = liveMentoringReservationDetailSchema.parse(DETAIL);
    expect(parsed.questionUpdatedAt).toBeUndefined();
  });

  it('questionUpdatedAt 이 null 이어도 통과한다', () => {
    const parsed = liveMentoringReservationDetailSchema.parse({
      ...DETAIL,
      questionUpdatedAt: null,
    });
    expect(parsed.questionUpdatedAt).toBeNull();
  });

  it('동의하지 않은 건은 attachmentUrl 이 null 로 온다', () => {
    const parsed = liveMentoringReservationDetailSchema.parse({
      ...DETAIL,
      attachmentUrl: null,
      mentorShareAgreed: false,
    });

    expect(parsed.attachmentUrl).toBeNull();
    expect(parsed.attachmentType).toBe('URL');
  });

  it('질문 미작성(나중에 작성하기) 건은 questionContent 가 null 이다', () => {
    const parsed = liveMentoringReservationDetailSchema.parse({
      ...DETAIL,
      questionDeferred: true,
      questionContent: null,
      attachmentType: 'NONE',
      attachmentUrl: null,
      mentorShareAgreed: false,
    });

    expect(parsed.questionDeferred).toBe(true);
    expect(parsed.questionContent).toBeNull();
    expect(parsed.attachmentType).toBe('NONE');
  });

  it('세 가지 첨부 종류를 모두 받는다', () => {
    for (const attachmentType of ['NONE', 'FILE', 'URL'] as const) {
      const parsed = liveMentoringReservationDetailSchema.parse({
        ...DETAIL,
        attachmentType,
        attachmentUrl: attachmentType === 'URL' ? DETAIL.attachmentUrl : null,
      });
      expect(parsed.attachmentType).toBe(attachmentType);
    }
  });

  it('알 수 없는 첨부 종류는 거부한다', () => {
    expect(() =>
      liveMentoringReservationDetailSchema.parse({
        ...DETAIL,
        attachmentType: 'IMAGE',
      }),
    ).toThrow();
  });

  it('mentoringCategory 가 null 이어도 통과한다 — 백필 전 기존 행', () => {
    const parsed = liveMentoringReservationDetailSchema.parse({
      ...DETAIL,
      mentoringCategory: null,
    });
    expect(parsed.mentoringCategory).toBeNull();
  });

  it('알 수 없는 멘토링 카테고리는 거부한다', () => {
    expect(() =>
      liveMentoringReservationDetailSchema.parse({
        ...DETAIL,
        mentoringCategory: 'COVER_LETTER',
      }),
    ).toThrow();
  });

  it('필수 필드가 빠지면 거부한다', () => {
    const { menteeName: _menteeName, ...withoutMenteeName } = DETAIL;
    expect(() =>
      liveMentoringReservationDetailSchema.parse(withoutMenteeName),
    ).toThrow();
  });

  it('파일 첨부 이름·주소 필드는 계약에 없다 — 통과해도 결과에 남지 않는다', () => {
    const parsed = liveMentoringReservationDetailSchema.parse({
      ...DETAIL,
      attachmentType: 'FILE',
      attachmentUrl: null,
      attachmentFileName: '이력서.pdf',
      attachmentFileUrl: 'https://bucket.s3.amazonaws.com/이력서.pdf',
    });

    expect(parsed).not.toHaveProperty('attachmentFileName');
    expect(parsed).not.toHaveProperty('attachmentFileUrl');
  });
});
