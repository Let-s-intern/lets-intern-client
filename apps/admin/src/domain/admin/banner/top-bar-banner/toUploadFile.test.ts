import { describe, expect, it } from 'vitest';
import { toUploadFile } from './toUploadFile';

describe('toUploadFile', () => {
  it('같은 이름의 파일도 서로 다른 이름으로 올린다', () => {
    const file = new File(['a'], '배너.webp', { type: 'image/webp' });
    expect(toUploadFile(file).name).not.toBe(toUploadFile(file).name);
  });

  it('확장자와 파일 형식을 유지한다', () => {
    const uploaded = toUploadFile(
      new File(['a'], '렛츠콘 배너.WEBP', { type: 'image/webp' }),
    );
    expect(uploaded.name).toMatch(/^[0-9a-f-]+\.webp$/);
    expect(uploaded.type).toBe('image/webp');
  });
});
