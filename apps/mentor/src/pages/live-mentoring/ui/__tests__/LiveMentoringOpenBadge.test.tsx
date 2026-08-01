import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { OpeningHistoryItem } from '@/api/live-mentoring/liveMentoringSchema';

let queryState: { data?: OpeningHistoryItem[] } = {};

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringOpenStatusQuery: () => queryState,
}));

import LiveMentoringOpenBadge from '../LiveMentoringOpenBadge';

const opening = (
  openingId: number,
  status: OpeningHistoryItem['status'],
): OpeningHistoryItem => ({
  openingId,
  status,
  durationPrices: [{ duration: 30, price: 35000 }],
  feedbackStartDate: '2026-07-14',
  feedbackEndDate: '2026-07-28',
  openedAt: '2026-07-10T09:00:00',
  closedAt: status === 'CLOSED' ? '2026-07-29T00:05:00' : null,
  closeReason: status === 'CLOSED' ? 'PERIOD_EXPIRED' : null,
});

afterEach(() => {
  queryState = {};
});

describe('LiveMentoringOpenBadge', () => {
  it('활성 개설이 있으면 오픈중 배지를 노출한다', () => {
    queryState = { data: [opening(2, 'OPEN'), opening(1, 'CLOSED')] };
    render(<LiveMentoringOpenBadge />);
    expect(screen.getByText('오픈중')).toBeInTheDocument();
  });

  it('종료된 개설만 있으면 아무것도 렌더하지 않는다', () => {
    queryState = { data: [opening(2, 'CLOSED'), opening(1, 'CLOSED')] };
    const { container } = render(<LiveMentoringOpenBadge />);
    expect(container).toBeEmptyDOMElement();
  });

  it('개설한 적이 없으면 아무것도 렌더하지 않는다', () => {
    queryState = { data: [] };
    const { container } = render(<LiveMentoringOpenBadge />);
    expect(container).toBeEmptyDOMElement();
  });

  it('아직 불러오지 못했으면 아무것도 렌더하지 않는다', () => {
    queryState = {};
    const { container } = render(<LiveMentoringOpenBadge />);
    expect(container).toBeEmptyDOMElement();
  });
});
