import { describe, expect, it } from 'vitest';

import { cropRect, outputMimeFor, renameForMime } from '../processProfileImage';

/*
 * 실제 그리기(canvas 픽셀)는 여기서 검증하지 않는다. vitest 환경이 jsdom 이라 canvas 가 없다.
 * 대신 계산과 계약만 본다.
 *
 * 확장자는 서버와 맞물린다 — 서버 `S3Utils.saveFile()` 은 넘어온 파일명을 그대로 S3 키로
 * 쓰고 확장자를 검증하지 않는다. 이름과 실제 바이트가 어긋나도 아무도 막아 주지 않는다.
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

describe('cropRect', () => {
  it('짧은 변을 한 변으로 하는 정사각형을 잘라낸다', () => {
    expect(cropRect(720, 900, { x: 0.5, y: 0.5 }).side).toBe(720);
    expect(cropRect(900, 720, { x: 0.5, y: 0.5 }).side).toBe(720);
  });

  it('세로 사진은 위아래로만 움직인다', () => {
    const top = cropRect(720, 900, { x: 0.5, y: 0 });
    const bottom = cropRect(720, 900, { x: 0.5, y: 1 });

    expect(top.y).toBe(0);
    expect(bottom.y).toBe(180);
    // 좌우로는 여백이 없어 x 값이 무시된다.
    expect(top.x).toBe(0);
    expect(bottom.x).toBe(0);
  });

  it('가로 사진은 좌우로만 움직인다', () => {
    expect(cropRect(1000, 400, { x: 0, y: 0.5 }).x).toBe(0);
    expect(cropRect(1000, 400, { x: 1, y: 0.5 }).x).toBe(600);
    expect(cropRect(1000, 400, { x: 1, y: 0.5 }).y).toBe(0);
  });

  it('가운데(0.5)면 양쪽이 똑같이 잘린다', () => {
    expect(cropRect(720, 900, { x: 0.5, y: 0.5 }).y).toBe(90);
  });

  it('범위를 벗어난 값은 잘라 낸다', () => {
    expect(cropRect(720, 900, { x: 0.5, y: 5 }).y).toBe(180);
    expect(cropRect(720, 900, { x: 0.5, y: -3 }).y).toBe(0);
  });

  it('정사각형 원본은 잘라낼 것이 없다', () => {
    expect(cropRect(600, 600, { x: 0, y: 1 })).toEqual({
      x: 0,
      y: 0,
      side: 600,
    });
  });
});
