import { describe, expect, it } from 'vitest';
import { magnetApplicationByMagnetSchema } from './leadManagement';

describe('magnetApplicationByMagnetSchema', () => {
  it('createDate 포함 정상 응답을 파싱한다', () => {
    const data = {
      magnetApplicationId: 1,
      name: '홍길동',
      phoneNum: '01012345678',
      grade: '3학년',
      wishField: '개발',
      wishJob: '프론트엔드',
      wishIndustry: 'IT',
      wishCompany: '렛츠커리어',
      marketingAgree: true,
      questionAnswerList: [
        { question: '지원 동기', answer: '성장하고 싶어서' },
      ],
      createDate: '2026-05-12T13:24:00',
    };

    const result = magnetApplicationByMagnetSchema.parse(data);
    expect(result.createDate).toBe('2026-05-12T13:24:00');
    expect(result.magnetApplicationId).toBe(1);
  });

  it('nullable 필드가 null이어도 파싱한다', () => {
    const data = {
      magnetApplicationId: 2,
      name: null,
      phoneNum: null,
      grade: null,
      wishField: null,
      wishJob: null,
      wishIndustry: null,
      wishCompany: null,
      marketingAgree: false,
      questionAnswerList: [],
      createDate: '2026-05-01T09:00:00',
    };

    const result = magnetApplicationByMagnetSchema.parse(data);
    expect(result.name).toBeNull();
    expect(result.createDate).toBe('2026-05-01T09:00:00');
  });

  it('createDate가 누락되면 파싱이 실패한다', () => {
    const data = {
      magnetApplicationId: 3,
      name: '김철수',
      phoneNum: '01099998888',
      grade: '4학년',
      wishField: '디자인',
      wishJob: 'UX',
      wishIndustry: '플랫폼',
      wishCompany: '회사',
      marketingAgree: true,
      questionAnswerList: [],
    };

    expect(() => magnetApplicationByMagnetSchema.parse(data)).toThrow();
  });
});
