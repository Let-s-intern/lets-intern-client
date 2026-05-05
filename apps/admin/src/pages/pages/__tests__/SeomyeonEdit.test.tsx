import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

/**
 * PRD-서면라이브 분리 §5.1/§5.2 — SeomyeonEdit이 LiveEdit에 type='SEOMYEON'을
 * 전달하는지 검증.
 */

vi.mock('../LiveEdit', () => ({
  default: vi.fn(() => null),
}));

describe('SeomyeonEdit — LiveEdit type prop 전파', () => {
  it("LiveEdit에 type='SEOMYEON', titleOverride='서면 수정'을 전달한다", async () => {
    const LiveEditModule = await import('../LiveEdit');
    const SeomyeonEditModule = await import('../SeomyeonEdit');
    render(<SeomyeonEditModule.default />);

    expect(LiveEditModule.default).toHaveBeenCalled();
    const lastCall = (LiveEditModule.default as unknown as { mock: { calls: unknown[][] } }).mock
      .calls[0];
    expect(lastCall[0]).toMatchObject({
      type: 'SEOMYEON',
      titleOverride: '서면 수정',
    });
  });
});
