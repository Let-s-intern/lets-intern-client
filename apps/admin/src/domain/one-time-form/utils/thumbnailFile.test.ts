import { describe, expect, it } from 'vitest';

import { THUMBNAIL_MAX_BYTES, validateThumbnailFile } from './thumbnailFile';

const fileOf = (name: string, size: number) => {
  const file = new File(['x'], name);
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('validateThumbnailFile', () => {
  it.each(['a.jpg', 'a.jpeg', 'a.png', 'a.webp', 'A.PNG'])(
    '%s 는 올릴 수 있다',
    (name) => {
      expect(validateThumbnailFile(fileOf(name, 1000))).toBeNull();
    },
  );

  it('정확히 2MB 는 통과한다', () => {
    expect(
      validateThumbnailFile(fileOf('a.png', THUMBNAIL_MAX_BYTES)),
    ).toBeNull();
  });

  it('2MB 를 넘으면 거절한다', () => {
    expect(
      validateThumbnailFile(fileOf('a.png', THUMBNAIL_MAX_BYTES + 1)),
    ).toBe('2MB 이하 이미지만 올릴 수 있습니다.');
  });

  it.each(['a.gif', 'a.svg', 'a.pdf', 'png'])('%s 는 거절한다', (name) => {
    expect(validateThumbnailFile(fileOf(name, 1000))).toBe(
      'jpg, png, webp 이미지만 올릴 수 있습니다.',
    );
  });
});
