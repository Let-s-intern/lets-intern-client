import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  generateDuplicateThumbnails,
  getThumbnailBlockReason,
  getThumbnailTitles,
} from '../duplicateThumbnail';

const { generateAndUploadThumbnail } = vi.hoisted(() => ({
  generateAndUploadThumbnail: vi.fn(),
}));

vi.mock('@/api/file', () => ({
  fileType: { enum: { CHALLENGE: 'CHALLENGE' } },
  uploadFile: vi.fn(),
}));

vi.mock('../generateThumbnail', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../generateThumbnail')>()),
  generateAndUploadThumbnail,
}));

beforeEach(() => {
  generateAndUploadThumbnail.mockReset();
});

const base = { copyContent: false, versionTitles: [] as string[] };

describe('getThumbnailBlockReason', () => {
  it('이전 내용 그대로 가져오기를 켜면 제목과 상관없이 막힌다', () => {
    expect(
      getThumbnailBlockReason({
        ...base,
        copyContent: true,
        challengeType: 'EXPERIENCE_SUMMARY',
        title: '경험정리 챌린지 10기',
      }),
    ).toBe('COPY_CONTENT');
  });

  it('챌린지 유형을 아직 못 받았으면 불러오는 중이다', () => {
    expect(
      getThumbnailBlockReason({ ...base, challengeType: null, title: '10기' }),
    ).toBe('LOADING');
  });

  it('지원하지 않는 유형', () => {
    expect(
      getThumbnailBlockReason({
        ...base,
        challengeType: 'ETC',
        title: '기타 챌린지 10기',
      }),
    ).toBe('UNSUPPORTED_TYPE');
  });

  it('버전 없는 이력서는 제목에 [ ] 가 없으면 지원하지 않는다', () => {
    expect(
      getThumbnailBlockReason({
        ...base,
        challengeType: 'CAREER_START',
        title: '이력서 챌린지 10기',
      }),
    ).toBe('UNSUPPORTED_TYPE');
  });

  it('버전 있는 이력서는 제목에 [ ] 가 없어도 버전명으로 만들 수 있다', () => {
    expect(
      getThumbnailBlockReason({
        copyContent: false,
        challengeType: 'CAREER_START',
        title: '이력서 챌린지 10기',
        versionTitles: ['대학생 Ver.', '인턴 Ver.'],
      }),
    ).toBeNull();
  });

  it('기수가 없으면 막힌다', () => {
    expect(
      getThumbnailBlockReason({
        ...base,
        challengeType: 'EXPERIENCE_SUMMARY',
        title: '경험정리 챌린지',
      }),
    ).toBe('NO_GENERATION');
  });

  it('자기소개서·포트폴리오는 주차가 없으면 막힌다', () => {
    expect(
      getThumbnailBlockReason({
        ...base,
        challengeType: 'PORTFOLIO',
        title: '포트폴리오 완성 챌린지 43기',
        versionTitles: ['대학생 Ver.'],
      }),
    ).toBe('NO_WEEK');
    expect(
      getThumbnailBlockReason({
        ...base,
        challengeType: 'PERSONAL_STATEMENT',
        title: '자기소개서 2주 완성 챌린지 36기',
      }),
    ).toBeNull();
  });
});

describe('getThumbnailTitles', () => {
  it('버전이 있으면 버전마다 [버전명] 제목을 만든다', () => {
    expect(getThumbnailTitles('챌린지 10기', ['대학생', '인턴'])).toEqual([
      '[대학생] 챌린지 10기',
      '[인턴] 챌린지 10기',
    ]);
  });

  it('버전이 없으면 제목 그대로다', () => {
    expect(getThumbnailTitles('챌린지 10기', [])).toEqual(['챌린지 10기']);
  });
});

describe('generateDuplicateThumbnails', () => {
  it('버전이 있으면 대표 + 버전 수만큼 만들고 버전 id 로 묶는다', async () => {
    generateAndUploadThumbnail.mockImplementation(
      async (_type: string, title: string) => `url:${title}`,
    );

    const result = await generateDuplicateThumbnails(
      'CAREER_START',
      '이력서 챌린지 10기',
      [
        { challengeVersionId: 39, title: '대학생 Ver.' },
        { challengeVersionId: 40, title: '인턴 Ver.' },
      ],
    );

    expect(generateAndUploadThumbnail).toHaveBeenCalledTimes(3);
    expect(result).toEqual({
      thumbnail: 'url:이력서 챌린지 10기',
      versionThumbnails: [
        {
          sourceChallengeVersionId: 39,
          thumbnail: 'url:[대학생 Ver.] 이력서 챌린지 10기',
          desktopThumbnail: 'url:[대학생 Ver.] 이력서 챌린지 10기',
        },
        {
          sourceChallengeVersionId: 40,
          thumbnail: 'url:[인턴 Ver.] 이력서 챌린지 10기',
          desktopThumbnail: 'url:[인턴 Ver.] 이력서 챌린지 10기',
        },
      ],
    });
  });

  it('버전이 없으면 대표 썸네일만 만들고 버전 목록은 null 이다', async () => {
    generateAndUploadThumbnail.mockResolvedValue('url');

    const result = await generateDuplicateThumbnails(
      'PERSONAL_STATEMENT',
      '자기소개서 2주 완성 챌린지 36기',
      [],
    );

    expect(generateAndUploadThumbnail).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ thumbnail: 'url', versionThumbnails: null });
  });
});
