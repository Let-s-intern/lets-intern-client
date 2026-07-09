import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { SettlementRow } from '@/api/live-mentoring/liveMentoringSchema';

let queryState: { data?: SettlementRow[]; isLoading: boolean } = {
  data: undefined,
  isLoading: false,
};

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringSettlementQuery: () => queryState,
}));

import SettlementPage from '../SettlementPage';

const rows: SettlementRow[] = [
  { period: '2026-06', completedCount: 18, grossAmount: 1080000, status: 'PAID' },
  {
    period: '2026-04',
    completedCount: 9,
    grossAmount: 540000,
    status: 'PENDING',
  },
];

afterEach(() => {
  queryState = { data: undefined, isLoading: false };
});

describe('SettlementPage', () => {
  it('정산행을 표로 렌더한다', () => {
    queryState = { data: rows, isLoading: false };
    render(<SettlementPage />);

    expect(screen.getByText('2026-06')).toBeInTheDocument();
    expect(screen.getByText('18건')).toBeInTheDocument();
    expect(screen.getByText('1,080,000원')).toBeInTheDocument();
    expect(screen.getByText('정산 완료')).toBeInTheDocument();
    expect(screen.getByText('정산 예정')).toBeInTheDocument();
  });

  it('데이터가 없으면 빈 상태 문구를 노출한다', () => {
    queryState = { data: [], isLoading: false };
    render(<SettlementPage />);

    expect(screen.getByText('정산 내역이 없습니다.')).toBeInTheDocument();
  });

  it('로딩 중에는 로딩 문구를 노출한다', () => {
    queryState = { data: undefined, isLoading: true };
    render(<SettlementPage />);

    expect(screen.getByText('불러오는 중...')).toBeInTheDocument();
  });
});
