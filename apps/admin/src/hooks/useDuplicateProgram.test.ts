import { describe, expect, it, vi } from 'vitest';

import { getChallengeIdSchema } from '@/schema';

// 모듈이 불러오는 API 훅이 axios 인스턴스를 만들면서 환경변수를 요구한다. 변환 함수만 검증한다.
vi.mock('@/utils/axios', () => ({ default: {} }));

import { challengeToCreateInput } from './useDuplicateProgram';

const baseChallenge = {
  title: '챌린지',
  challengeType: 'ETC',
  classificationInfo: [],
  priceInfo: [],
  faqInfo: [],
};

describe('challengeToCreateInput - 버전 복사 (D4)', () => {
  it('원본 버전을 id 없이 제목·순서만 옮긴다', () => {
    const challenge = getChallengeIdSchema.parse({
      ...baseChallenge,
      versionList: [
        { challengeVersionId: 11, title: '대학생', sortOrder: 0 },
        { challengeVersionId: 12, title: '이직자', sortOrder: 1 },
      ],
    });

    const result = challengeToCreateInput(challenge);

    expect(result.versionInfo).toEqual([
      { challengeVersionId: null, title: '대학생', sortOrder: 0 },
      { challengeVersionId: null, title: '이직자', sortOrder: 1 },
    ]);
  });

  it('버전 없는 챌린지는 요청 본문에 versionInfo 를 싣지 않는다', () => {
    const challenge = getChallengeIdSchema.parse(baseChallenge);

    const body = JSON.parse(JSON.stringify(challengeToCreateInput(challenge)));

    expect(body).not.toHaveProperty('versionInfo');
  });
});
