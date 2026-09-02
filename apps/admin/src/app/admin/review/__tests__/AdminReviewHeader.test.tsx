import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import AdminReviewHeader from '../AdminReviewHeader';

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AdminReviewHeader />
    </MemoryRouter>,
  );

/**
 * 기존 "라이브 멘토링"(라이브 피드백) 탭과 신규 "1:1 라이브 멘토링" 탭이 경로도
 * 활성 상태도 서로 침범하지 않는지 확인한다.
 */
describe('AdminReviewHeader', () => {
  it('두 탭 모두 올바른 경로로 링크된다', () => {
    renderAt('/review/live');

    expect(screen.getByRole('link', { name: '라이브 멘토링' })).toHaveAttribute(
      'href',
      '/review/live-mentoring',
    );
    expect(
      screen.getByRole('link', { name: '1:1 라이브 멘토링' }),
    ).toHaveAttribute('href', '/review/live-mentoring-1on1');
  });

  it('/review/live-mentoring-1on1 에서는 신규 탭만 활성화된다', () => {
    renderAt('/review/live-mentoring-1on1');

    expect(
      screen.getByRole('link', { name: '1:1 라이브 멘토링' }),
    ).toHaveAttribute('aria-current', 'page');
    expect(
      screen.getByRole('link', { name: '라이브 멘토링' }),
    ).not.toHaveAttribute('aria-current');
  });

  it('/review/live-mentoring 에서는 기존 탭만 활성화된다', () => {
    renderAt('/review/live-mentoring');

    expect(screen.getByRole('link', { name: '라이브 멘토링' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(
      screen.getByRole('link', { name: '1:1 라이브 멘토링' }),
    ).not.toHaveAttribute('aria-current');
  });
});
