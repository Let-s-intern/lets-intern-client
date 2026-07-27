import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { LiveMentoringSettings } from '@/api/live-mentoring/liveMentoringSchema';

let queryState: { data?: LiveMentoringSettings } = {};

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringSettingsQuery: () => queryState,
}));

import LiveMentoringOpenBadge from '../LiveMentoringOpenBadge';

const settings = (isOpen: boolean) =>
  ({ isOpen }) as unknown as LiveMentoringSettings;

afterEach(() => {
  queryState = {};
});

describe('LiveMentoringOpenBadge', () => {
  it('오픈 중이면 오픈중 배지를 노출한다', () => {
    queryState = { data: settings(true) };
    render(<LiveMentoringOpenBadge />);
    expect(screen.getByText('오픈중')).toBeInTheDocument();
  });

  it('오픈 중이 아니면 아무것도 렌더하지 않는다', () => {
    queryState = { data: settings(false) };
    const { container } = render(<LiveMentoringOpenBadge />);
    expect(container).toBeEmptyDOMElement();
  });

  it('아직 불러오지 못했으면 아무것도 렌더하지 않는다', () => {
    queryState = {};
    const { container } = render(<LiveMentoringOpenBadge />);
    expect(container).toBeEmptyDOMElement();
  });
});
