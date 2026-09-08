import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { OpeningHistoryItem } from '@/api/live-mentoring/liveMentoringSchema';

let queryState: { data?: OpeningHistoryItem[] } = {};

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringOpenStatusQuery: () => queryState,
}));

import LiveMentoringOpenBadge from '../LiveMentoringOpenBadge';

const opening = (status: 'OPEN' | 'CLOSED'): OpeningHistoryItem => ({
  openingId: 100,
  status,
  durationPrices: [{ duration: 30, price: 35000 }],
  feedbackStartDate: '2026-08-01',
  feedbackEndDate: '2026-08-31',
  openedAt: '2026-07-31T10:00:00',
  closedAt: status === 'CLOSED' ? '2026-08-05T10:00:00' : null,
  closeReason: status === 'CLOSED' ? 'MENTOR_CANCELED' : null,
});

afterEach(() => {
  queryState = {};
});

describe('LiveMentoringOpenBadge', () => {
  it('활성 개설이 있으면 오픈중 배지를 노출한다', () => {
    queryState = { data: [opening('OPEN')] };
    render(<LiveMentoringOpenBadge />);
    expect(screen.getByText('오픈중')).toBeInTheDocument();
  });

  // 상품이 승인(APPROVED)이어도 개설을 종료했으면 열려 있지 않다.
  it('개설이 모두 종료됐으면 아무것도 렌더하지 않는다', () => {
    queryState = { data: [opening('CLOSED')] };
    const { container } = render(<LiveMentoringOpenBadge />);
    expect(container).toBeEmptyDOMElement();
  });

  it('개설 이력이 비어 있으면 아무것도 렌더하지 않는다', () => {
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
