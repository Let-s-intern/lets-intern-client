import { describe, expect, it } from 'vitest';

import {
  adminMentorApplicationDetailSchema,
  adminMentorApplicationListSchema,
} from '../mentorApplicationSchema';

const item = {
  id: 1,
  submittedAt: '2026-10-28T14:02:00',
  name: '김하늘',
  company: '예시테크',
  jobTitle: '프로덕트 매니저',
  phoneNum: '01012345678',
  email: 'haneul.kim@example.com',
  preferredContactMethods: ['PHONE', 'EMAIL'],
  status: 'CHECKING',
  hasAttachment: true,
};

describe('adminMentorApplicationListSchema', () => {
  it('배열 응답을 그대로 목록으로 파싱한다', () => {
    expect(adminMentorApplicationListSchema.parse([item])).toEqual([item]);
  });

  it('객체로 감싼 응답이면 안의 배열을 목록으로 본다', () => {
    expect(
      adminMentorApplicationListSchema.parse({
        applicationList: [item],
        pageInfo: { pageNum: 1 },
      }),
    ).toEqual([item]);
  });

  it('알 수 없는 상태 값이면 실패한다', () => {
    expect(() =>
      adminMentorApplicationListSchema.parse([{ ...item, status: 'DONE' }]),
    ).toThrow();
  });
});

describe('adminMentorApplicationDetailSchema', () => {
  /* 서버 GetAdminMentorApplicationResponseDto 와 같은 키·순서. 목록 전용 hasAttachment 는 없다 */
  const detail = {
    id: 1,
    userId: 10,
    submittedAt: '2026-10-28T14:02:00',
    name: '김하늘',
    company: '예시테크',
    jobTitle: '프로덕트 매니저',
    yearsOfExperience: 7,
    phoneNum: '01012345678',
    email: 'haneul.kim@example.com',
    preferredContactMethods: ['PHONE', 'EMAIL'],
    jobFields: ['SERVICE_PLANNING_PM', 'DATA_AI'],
    mentoringTypes: ['DOCUMENT_REVIEW'],
    introduction: '자기소개',
    motivation: '지원 동기',
    snsLinks: ['https://example.com/portfolio'],
    attachmentUrl: 'https://cdn.example.com/a.pdf',
    attachmentName: 'a.pdf',
    privacyAgreedAt: '2026-10-28T14:02:00',
    status: 'CHECKING',
    expectedReplyDate: '2026-11-04',
    adminMemo: '메모',
  };

  it('서버 상세 응답(hasAttachment 없음)을 파싱한다', () => {
    expect(detail).not.toHaveProperty('hasAttachment');
    expect(adminMentorApplicationDetailSchema.safeParse(detail).success).toBe(
      true,
    );
  });

  it('전체 항목을 파싱한다', () => {
    expect(adminMentorApplicationDetailSchema.parse(detail)).toEqual(detail);
  });

  it('선택 항목이 null 이면 그대로 두고, snsLinks 는 빈 배열로 맞춘다', () => {
    const parsed = adminMentorApplicationDetailSchema.parse({
      ...detail,
      introduction: null,
      motivation: null,
      snsLinks: null,
      attachmentUrl: null,
      attachmentName: null,
      userId: null,
      adminMemo: null,
    });
    expect(parsed.snsLinks).toEqual([]);
    expect(parsed.adminMemo).toBeNull();
    expect(parsed.attachmentUrl).toBeNull();
  });

  it('알 수 없는 직무 분야면 실패한다', () => {
    expect(() =>
      adminMentorApplicationDetailSchema.parse({
        ...detail,
        jobFields: ['UNKNOWN'],
      }),
    ).toThrow();
  });
});
