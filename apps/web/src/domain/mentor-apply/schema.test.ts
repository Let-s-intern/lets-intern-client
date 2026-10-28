import {
  JOB_FIELD_OPTIONS,
  MAX_FILE_SIZE,
  mentorApplyDefaultValues,
  mentorApplyFormSchema,
  MentorApplyFormValues,
  toMentorApplicationRequest,
} from './schema';

const validValues: MentorApplyFormValues = {
  ...mentorApplyDefaultValues,
  name: '홍길동',
  company: '렛츠커리어',
  jobTitle: '백엔드 개발',
  yearsOfExperience: '5',
  phoneNum: '010-1234-5678',
  email: 'mentor@example.com',
  preferredContactMethods: ['EMAIL'],
  jobFields: ['DEVELOPMENT_IT'],
  mentoringTypes: ['MOCK_INTERVIEW'],
  privacyAgreed: true,
};

const errorOf = (
  overrides: Partial<MentorApplyFormValues>,
  path: keyof MentorApplyFormValues,
) => {
  const result = mentorApplyFormSchema.safeParse({
    ...validValues,
    ...overrides,
  });
  if (result.success) return undefined;
  return result.error.issues.find((i) => i.path[0] === path)?.message;
};

const pdf = (size: number, name = 'resume.pdf', type = 'application/pdf') => {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('mentorApplyFormSchema', () => {
  it('필수값을 모두 채우면 통과한다', () => {
    expect(mentorApplyFormSchema.safeParse(validValues).success).toBe(true);
  });

  it('빈 값과 공백만 있는 필수 문자열을 거른다', () => {
    expect(errorOf({ name: '   ' }, 'name')).toBe('성함을 입력해 주세요.');
    expect(errorOf({ company: '' }, 'company')).toBe('소속을 입력해 주세요.');
    expect(errorOf({ jobTitle: '' }, 'jobTitle')).toBe('직무를 입력해 주세요.');
    expect(errorOf({ email: '' }, 'email')).toBe('이메일을 입력해 주세요.');
  });

  it('연차는 0~60 정수만 받는다', () => {
    expect(errorOf({ yearsOfExperience: '0' }, 'yearsOfExperience')).toBe(
      undefined,
    );
    expect(errorOf({ yearsOfExperience: '60' }, 'yearsOfExperience')).toBe(
      undefined,
    );
    expect(errorOf({ yearsOfExperience: '61' }, 'yearsOfExperience')).toBe(
      '연차는 0~60 사이 숫자로 입력해 주세요.',
    );
    expect(errorOf({ yearsOfExperience: '-1' }, 'yearsOfExperience')).toBe(
      '연차는 0~60 사이 숫자로 입력해 주세요.',
    );
    expect(errorOf({ yearsOfExperience: '' }, 'yearsOfExperience')).toBe(
      '연차를 입력해 주세요.',
    );
  });

  it('전화번호는 숫자 10~11자리만 받는다', () => {
    expect(errorOf({ phoneNum: '010-123-4567' }, 'phoneNum')).toBe(undefined);
    expect(errorOf({ phoneNum: '010-123-456' }, 'phoneNum')).toBe(
      '숫자 10~11자리로 입력해 주세요.',
    );
  });

  it('이메일 형식을 검사한다', () => {
    expect(errorOf({ email: 'mentor@' }, 'email')).toBe(
      '올바른 이메일 형식이 아닙니다.',
    );
  });

  it('선택 항목은 하나 이상 골라야 한다', () => {
    expect(
      errorOf({ preferredContactMethods: [] }, 'preferredContactMethods'),
    ).toBe('선호 연락 수단을 선택해 주세요.');
    expect(errorOf({ jobFields: [] }, 'jobFields')).toBe(
      '멘토링 가능 분야를 선택해 주세요.',
    );
    expect(errorOf({ mentoringTypes: [] }, 'mentoringTypes')).toBe(
      '가능한 멘토링 형태를 선택해 주세요.',
    );
  });

  it('이력 소개와 전하고 싶은 말씀은 1000자까지 받는다', () => {
    expect(errorOf({ introduction: 'a'.repeat(1000) }, 'introduction')).toBe(
      undefined,
    );
    expect(errorOf({ motivation: 'a'.repeat(1001) }, 'motivation')).toBe(
      '1000자 이내로 입력해 주세요.',
    );
  });

  it('첨부는 PDF 10MB 까지 받는다', () => {
    expect(errorOf({ attachment: pdf(MAX_FILE_SIZE) }, 'attachment')).toBe(
      undefined,
    );
    expect(errorOf({ attachment: pdf(MAX_FILE_SIZE + 1) }, 'attachment')).toBe(
      '10MB 이하 파일만 첨부해 주세요.',
    );
    expect(
      errorOf({ attachment: pdf(10, 'photo.png', 'image/png') }, 'attachment'),
    ).toBe('PDF 파일만 첨부해 주세요.');
  });

  it('SNS 는 비워 두거나 http(s) 주소여야 하고 3개까지다', () => {
    expect(
      errorOf({ snsLinks: ['', 'https://blog.example.com', ''] }, 'snsLinks'),
    ).toBe(undefined);
    expect(
      errorOf({ snsLinks: ['javascript:alert(1)', '', ''] }, 'snsLinks'),
    ).toBe('올바른 주소를 입력해 주세요.');
    expect(errorOf({ snsLinks: ['', '', '', ''] }, 'snsLinks')).toBeDefined();
  });

  it('개인정보 동의가 없으면 거른다', () => {
    expect(errorOf({ privacyAgreed: false }, 'privacyAgreed')).toBe(
      '개인정보 수집·이용에 동의해 주세요.',
    );
  });

  it('멘토링 가능 분야는 시안 순서대로 12개다', () => {
    expect(JOB_FIELD_OPTIONS.map((o) => o.label)).toEqual([
      '경영기획·전략',
      '마케팅·브랜딩',
      '영업·영업관리',
      '인사·HR',
      '재무·회계',
      '개발·IT',
      '데이터·AI',
      '서비스기획·PM',
      '디자인',
      '생산·품질',
      '연구개발(R&D)',
      '기타',
    ]);
  });
});

describe('toMentorApplicationRequest', () => {
  it('전화번호는 숫자만, 연차는 숫자로, 빈 선택 항목은 빼고 보낸다', () => {
    expect(
      toMentorApplicationRequest({
        ...validValues,
        introduction: '  ',
        motivation: '함께하고 싶어요',
        snsLinks: ['', ' https://linkedin.com/in/a ', ''],
      }),
    ).toEqual({
      name: '홍길동',
      company: '렛츠커리어',
      jobTitle: '백엔드 개발',
      yearsOfExperience: 5,
      phoneNum: '01012345678',
      email: 'mentor@example.com',
      preferredContactMethods: ['EMAIL'],
      jobFields: ['DEVELOPMENT_IT'],
      mentoringTypes: ['MOCK_INTERVIEW'],
      introduction: undefined,
      motivation: '함께하고 싶어요',
      snsLinks: ['https://linkedin.com/in/a'],
      privacyAgreed: true,
    });
  });
});
