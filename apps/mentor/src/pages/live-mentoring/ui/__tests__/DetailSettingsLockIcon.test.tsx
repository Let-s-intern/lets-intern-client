import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { OpeningHistoryItem } from '@/api/live-mentoring/liveMentoringSchema';

let queryState: { data?: OpeningHistoryItem[] } = {};

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringOpenStatusQuery: () => queryState,
}));

import DetailSettingsLockIcon from '../DetailSettingsLockIcon';

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

describe('DetailSettingsLockIcon', () => {
  it('활성 개설이 있으면 잠금 아이콘을 노출한다', () => {
    queryState = { data: [opening('OPEN')] };
    const { getByLabelText } = render(<DetailSettingsLockIcon />);
    expect(getByLabelText('오픈 중에는 수정할 수 없어요')).toBeInTheDocument();
  });

  it('active가 아니면 흰 배경에서도 보이는 회색을 쓴다', () => {
    queryState = { data: [opening('OPEN')] };
    const { getByLabelText } = render(<DetailSettingsLockIcon />);
    expect(getByLabelText('오픈 중에는 수정할 수 없어요')).toHaveClass(
      'text-neutral-50',
    );
  });

  it('active면 선택된 메뉴 텍스트와 같은 강조색을 쓴다', () => {
    queryState = { data: [opening('OPEN')] };
    const { getByLabelText } = render(<DetailSettingsLockIcon active />);
    expect(getByLabelText('오픈 중에는 수정할 수 없어요')).toHaveClass(
      'text-primary',
    );
  });

  it('개설이 모두 종료됐으면 아무것도 렌더하지 않는다', () => {
    queryState = { data: [opening('CLOSED')] };
    const { container } = render(<DetailSettingsLockIcon />);
    expect(container).toBeEmptyDOMElement();
  });

  it('개설 이력이 비어 있으면 아무것도 렌더하지 않는다', () => {
    queryState = { data: [] };
    const { container } = render(<DetailSettingsLockIcon />);
    expect(container).toBeEmptyDOMElement();
  });

  it('아직 불러오지 못했으면 아무것도 렌더하지 않는다', () => {
    queryState = {};
    const { container } = render(<DetailSettingsLockIcon />);
    expect(container).toBeEmptyDOMElement();
  });
});
