import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { drawThumbnailOnCanvas } from './generateThumbnail';

vi.mock('@/api/file', () => ({ uploadFile: vi.fn() }));

const ctx = {
  drawImage: vi.fn(),
  fillText: vi.fn(),
  roundRect: vi.fn(),
  fill: vi.fn(),
  beginPath: vi.fn(),
  measureText: vi.fn(() => ({ width: 100 })),
};
const loadedSrcs: string[] = [];

class FakeImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  set src(value: string) {
    loadedSrcs.push(value);
    queueMicrotask(() => this.onload?.());
  }
}

beforeEach(() => {
  loadedSrcs.length = 0;
  vi.clearAllMocks();
  vi.stubGlobal('Image', FakeImage);
  const createElement = document.createElement.bind(document);
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    if (tag !== 'canvas') return createElement(tag);
    return {
      width: 0,
      height: 0,
      getContext: () => ctx,
      toBlob: (cb: (blob: Blob) => void) => cb(new Blob(['png'])),
    } as unknown as HTMLCanvasElement;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('drawThumbnailOnCanvas', () => {
  it('제목에 기수가 없어도 만든다', async () => {
    const blob = await drawThumbnailOnCanvas(
      'EXPERIENCE_SUMMARY',
      '기필코 경험정리 챌린지',
    );
    expect(blob).toBeInstanceOf(Blob);
  });

  it('기수 배지와 Ver 배너를 그리지 않고 배경만 그린다', async () => {
    await drawThumbnailOnCanvas(
      'EXPERIENCE_SUMMARY',
      '[인턴·실무 경험자 Ver.] 기필코 경험정리 챌린지 42기',
    );
    expect(ctx.drawImage).toHaveBeenCalledTimes(1);
    expect(ctx.roundRect).not.toHaveBeenCalled();
    expect(ctx.fillText).not.toHaveBeenCalled();
  });

  it('버전명이 있어도 일반 배경 이미지를 쓴다', async () => {
    await drawThumbnailOnCanvas(
      'PORTFOLIO',
      '[대학생 Ver.] 포트폴리오 2주 완성 챌린지 30기',
    );
    expect(loadedSrcs).toEqual(['/images/challenge-thumbnail-portfolio.png']);
  });

  it('이력서는 버전명이 없어도 Ver 이미지를 배경으로 배너 없이 만든다', async () => {
    const blob = await drawThumbnailOnCanvas('CAREER_START', '이력서 챌린지');
    expect(blob).toBeInstanceOf(Blob);
    expect(loadedSrcs).toEqual([
      '/images/challenge-thumbnail-career-start-ver.png',
    ]);
    expect(ctx.roundRect).not.toHaveBeenCalled();
    expect(ctx.fillText).not.toHaveBeenCalled();
  });

  it('자기소개서·포트폴리오는 주차 제목만 그린다', async () => {
    await drawThumbnailOnCanvas(
      'PERSONAL_STATEMENT',
      '[대기업 Ver.] 자기소개서 2주 완성 챌린지 36기',
    );
    expect(ctx.fillText).toHaveBeenCalledTimes(1);
    expect(ctx.fillText).toHaveBeenCalledWith(
      '자기소개서 2주 완성 챌린지',
      expect.any(Number),
      expect.any(Number),
    );
    expect(ctx.roundRect).not.toHaveBeenCalled();
  });

  it('자기소개서·포트폴리오는 주차가 없으면 만들지 않는다', async () => {
    expect(
      await drawThumbnailOnCanvas('PORTFOLIO', '포트폴리오 완성 챌린지 43기'),
    ).toBeNull();
  });

  it('지원하지 않는 유형은 만들지 않는다', async () => {
    expect(
      await drawThumbnailOnCanvas('MARKETING', '마케팅 챌린지 10기'),
    ).toBeNull();
    expect(loadedSrcs).toEqual([]);
  });
});
