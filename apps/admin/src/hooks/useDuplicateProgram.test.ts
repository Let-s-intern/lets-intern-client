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
  it('원본 버전을 id 없이 제목·순서·노출 필드까지 옮긴다', () => {
    const challenge = getChallengeIdSchema.parse({
      ...baseChallenge,
      desc: '{"challenge":true}',
      versionList: [
        {
          challengeVersionId: 11,
          title: '대학생',
          sortOrder: 0,
          programTitle: '대학생 챌린지',
          shortDesc: '대학생 설명',
          thumbnail: 'm1.png',
          desktopThumbnail: 'd1.png',
          description: '{"version":11}',
        },
        {
          challengeVersionId: 12,
          title: '이직자',
          sortOrder: 1,
          programTitle: '이직자 챌린지',
          shortDesc: '이직자 설명',
          thumbnail: 'm2.png',
          desktopThumbnail: 'd2.png',
          // 서버가 비어 있는 본문을 챌린지 본문으로 채워 준 값
          description: '{"challenge":true}',
        },
      ],
    });

    const result = challengeToCreateInput(challenge);

    expect(result.versionInfo).toEqual([
      {
        challengeVersionId: null,
        title: '대학생',
        sortOrder: 0,
        programTitle: '대학생 챌린지',
        shortDesc: '대학생 설명',
        thumbnail: 'm1.png',
        desktopThumbnail: 'd1.png',
        description: '{"version":11}',
      },
      {
        challengeVersionId: null,
        title: '이직자',
        sortOrder: 1,
        programTitle: '이직자 챌린지',
        shortDesc: '이직자 설명',
        thumbnail: 'm2.png',
        desktopThumbnail: 'd2.png',
        description: null,
      },
    ]);
  });

  it('버전 없는 챌린지는 요청 본문에 versionInfo 를 싣지 않는다', () => {
    const challenge = getChallengeIdSchema.parse(baseChallenge);

    const body = JSON.parse(JSON.stringify(challengeToCreateInput(challenge)));

    expect(body).not.toHaveProperty('versionInfo');
  });
});
