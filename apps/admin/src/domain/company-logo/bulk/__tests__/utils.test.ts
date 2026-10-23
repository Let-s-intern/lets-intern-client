import { describe, expect, it } from 'vitest';

import { hostOf, MAX_BULK_SITES, parseSiteUrls } from '../utils/parseSiteUrls';
import { runWithLimit } from '../utils/runWithLimit';

describe('parseSiteUrls', () => {
  it('앞뒤 공백과 빈 줄을 빼고, 같은 호스트는 처음 것만 남긴다', () => {
    const result = parseSiteUrls(
      '  https://toss.im  \n\n https://www.toss.im/team\nkakaocorp.com\r\n\nhttps://kakaocorp.com',
    );
    expect(result.siteUrls).toEqual(['https://toss.im', 'kakaocorp.com']);
    expect(result.removedDuplicates).toBe(2);
    expect(result.isOverLimit).toBe(false);
  });

  it('이미 표에 있는 사이트도 중복으로 뺀다', () => {
    const result = parseSiteUrls('https://toss.im\nhttps://naver.com', [
      'toss.im',
    ]);
    expect(result.siteUrls).toEqual(['https://naver.com']);
    expect(result.removedDuplicates).toBe(1);
  });

  it(`정리한 뒤 ${MAX_BULK_SITES}개를 넘으면 상한 초과로 알린다`, () => {
    const lines = (count: number) =>
      Array.from({ length: count }, (_, i) => `https://site${i}.test`).join(
        '\n',
      );
    expect(parseSiteUrls(lines(MAX_BULK_SITES)).isOverLimit).toBe(false);
    expect(parseSiteUrls(lines(MAX_BULK_SITES + 1)).isOverLimit).toBe(true);
    // 중복을 빼고 30개면 통과
    expect(
      parseSiteUrls(`${lines(MAX_BULK_SITES)}\nhttps://site0.test`).isOverLimit,
    ).toBe(false);
  });

  it('hostOf 는 스킴이 없어도 읽고 www. 를 뗀다', () => {
    expect(hostOf('WWW.Toss.im/path')).toBe('toss.im');
    expect(hostOf('https://www.kakaocorp.com')).toBe('kakaocorp.com');
  });
});

describe('runWithLimit', () => {
  it('동시에 limit 개까지만 돌리고 모두 처리한다', async () => {
    let running = 0;
    let maxRunning = 0;
    const done: number[] = [];
    await runWithLimit([1, 2, 3, 4, 5, 6, 7], 3, async (item) => {
      running += 1;
      maxRunning = Math.max(maxRunning, running);
      await new Promise((resolve) => setTimeout(resolve, 5));
      done.push(item);
      running -= 1;
    });
    expect(maxRunning).toBe(3);
    expect(done.sort()).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('중단되면 아직 시작하지 않은 항목은 시작하지 않는다', async () => {
    const controller = new AbortController();
    const started: number[] = [];
    await runWithLimit(
      [1, 2, 3, 4, 5],
      2,
      async (item) => {
        started.push(item);
        if (item === 2) controller.abort();
        await Promise.resolve();
      },
      controller.signal,
    );
    expect(started).toEqual([1, 2]);
  });
});
