import { describe, expect, it } from 'vitest';

import { getChallengeIdSchema } from '@/schema';

import { toVersionDrafts } from './toVersionDrafts';
import { toVersionInfoPayload } from './toVersionInfoPayload';

const CHALLENGE_DESC = '{"challenge":true}';

// GET /challenge/{id} 응답 모양. 스키마를 거쳐 실제 화면이 받는 값으로 만든다
const parseDetail = (versionList: unknown[]) =>
  getChallengeIdSchema.parse({
    title: '챌린지',
    desc: CHALLENGE_DESC,
    challengeType: 'ETC',
    classificationInfo: [],
    priceInfo: [],
    faqInfo: [],
    versionList,
  });

const responseVersion = {
  challengeVersionId: 11,
  title: '대학생',
  sortOrder: 0,
  programTitle: '대학생 챌린지',
  shortDesc: '대학생 설명',
  thumbnail: 'm.png',
  desktopThumbnail: 'd.png',
  description: '{"version":11}',
};

describe('toVersionDrafts', () => {
  it('상세 응답의 버전 필드를 하나도 빠뜨리지 않고 옮긴다', () => {
    const detail = parseDetail([responseVersion]);

    const [result] = toVersionDrafts(detail.versionList, detail.desc);

    expect(result).toEqual({
      challengeVersionId: 11,
      title: '대학생',
      programTitle: '대학생 챌린지',
      shortDesc: '대학생 설명',
      thumbnail: 'm.png',
      desktopThumbnail: 'd.png',
      description: '{"version":11}',
    });
  });

  it('손대지 않고 저장해도 요청에 응답 값이 그대로 실린다', () => {
    const detail = parseDetail([responseVersion]);

    const [payload] = toVersionInfoPayload(
      toVersionDrafts(detail.versionList, detail.desc),
    );

    const { sortOrder, ...rest } = responseVersion;
    expect(payload).toEqual({ ...rest, sortOrder });
  });

  it('챌린지 본문으로 채워진 상세 본문은 챌린지 본문 사용(null) 으로 둔다', () => {
    const detail = parseDetail([
      { ...responseVersion, description: CHALLENGE_DESC },
    ]);

    const [result] = toVersionDrafts(detail.versionList, detail.desc);

    expect(result.description).toBeNull();
  });

  it('서버 배포 전 응답처럼 노출 필드가 없으면 빈 값으로 둔다', () => {
    const detail = parseDetail([
      { challengeVersionId: 11, title: '대학생', sortOrder: 0 },
    ]);

    const [result] = toVersionDrafts(detail.versionList, detail.desc);

    expect(result).toEqual({
      challengeVersionId: 11,
      title: '대학생',
      programTitle: '',
      shortDesc: null,
      thumbnail: '',
      desktopThumbnail: null,
      description: null,
    });
  });

  it('응답 순서를 유지한다', () => {
    const detail = parseDetail([
      { ...responseVersion, challengeVersionId: 12, title: '이직자' },
      responseVersion,
    ]);

    expect(
      toVersionDrafts(detail.versionList, detail.desc).map(
        ({ challengeVersionId }) => challengeVersionId,
      ),
    ).toEqual([12, 11]);
  });
});
