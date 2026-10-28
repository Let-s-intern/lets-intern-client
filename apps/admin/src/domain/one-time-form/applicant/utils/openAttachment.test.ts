import { afterEach, describe, expect, it, vi } from 'vitest';

import { openAttachment } from './openAttachment';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('openAttachment', () => {
  it('새 탭에 noopener, noreferrer 로 연다', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const url = 'https://bucket.example.com/a.pdf?X-Amz-Signature=x';

    openAttachment(url);

    expect(open).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer');
  });
});
