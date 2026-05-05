import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

/**
 * PRD-서면라이브 분리 §5.1/§5.2 — 서면 진입점이 LiveCreate에 type='SEOMYEON'을
 * 전달하는지 검증한다. LiveCreate 본체는 페이지 외부 의존(react-router/useAdminSnackbar/
 * react-query/api)이 많아 통합 렌더는 비용이 크므로, prop 전달만 가볍게 검증한다.
 *
 * LiveCreate에서 type → LiveBasic으로의 전파는 typecheck + LiveBasic.test.tsx 가
 * 보증한다.
 */

vi.mock('../LiveCreate', () => ({
  default: vi.fn(() => null),
}));

describe('SeomyeonCreate — LiveCreate type prop 전파', () => {
  it("LiveCreate에 type='SEOMYEON', titleOverride='서면 생성'을 전달한다", async () => {
    const LiveCreateModule = await import('../LiveCreate');
    const SeomyeonCreateModule = await import('../SeomyeonCreate');
    render(<SeomyeonCreateModule.default />);

    expect(LiveCreateModule.default).toHaveBeenCalled();
    const lastCall = (LiveCreateModule.default as unknown as { mock: { calls: unknown[][] } }).mock
      .calls[0];
    expect(lastCall[0]).toMatchObject({
      type: 'SEOMYEON',
      titleOverride: '서면 생성',
    });
  });
});
