import { describe, expect, it } from 'vitest';

import { outputMimeFor, renameForMime } from '../blurImage';

/*
 * 블러 자체(canvas 픽셀)는 여기서 검증하지 않는다. vitest 환경이 jsdom 이라 canvas 가 없다.
 * 대신 서버 계약과 맞물리는 부분만 본다 — 서버 `S3Utils.saveFile()` 은 넘어온 파일명을
 * 그대로 S3 키로 쓰고 확장자를 검증하지 않는다. 이름과 실제 바이트가 어긋나면 아무도
 * 막아 주지 않는다.
 */

describe('outputMimeFor', () => {
  it('PNG 는 알파를 살려야 하므로 PNG 로 내보낸다', () => {
    expect(outputMimeFor(new File([], 'a.png', { type: 'image/png' }))).toBe(
      'image/png',
    );
  });

  it('그 밖의 형식은 JPEG 로 내보낸다', () => {
    expect(outputMimeFor(new File([], 'a.jpg', { type: 'image/jpeg' }))).toBe(
      'image/jpeg',
    );
    expect(outputMimeFor(new File([], 'a.webp', { type: 'image/webp' }))).toBe(
      'image/jpeg',
    );
  });
});

describe('renameForMime', () => {
  it('JPEG 로 재인코딩하면 확장자도 함께 바뀐다', () => {
    expect(renameForMime('photo.png', 'image/jpeg')).toBe('photo.jpg');
  });

  it('PNG 로 나가면 png 확장자가 된다', () => {
    expect(renameForMime('photo.HEIC', 'image/png')).toBe('photo.png');
  });

  it('점이 여러 개면 마지막 것만 확장자로 본다', () => {
    expect(renameForMime('my.profile.v2.jpeg', 'image/jpeg')).toBe(
      'my.profile.v2.jpg',
    );
  });

  it('확장자가 없어도 붙여 준다', () => {
    expect(renameForMime('photo', 'image/jpeg')).toBe('photo.jpg');
  });
});
