import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type {
  SettlementItem,
  SettlementRow,
} from '@/api/live-mentoring/liveMentoringSchema';

type SettlementData = { settlementList: SettlementRow[]; itemList: SettlementItem[] };

let queryState: { data?: SettlementData; isLoading: boolean } = {
  data: undefined,
  isLoading: false,
};

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringSettlementQuery: () => queryState,
}));

import SettlementPage from '../SettlementPage';

const settlementList: SettlementRow[] = [
  { period: '2026-06', completedCount: 18, grossAmount: 1080000, status: 'PAID' },
  { period: '2026-04', completedCount: 9, grossAmount: 540000, status: 'PENDING' },
];

const itemList: SettlementItem[] = [
  {
    settlementId: 1,
    date: '2026-06-28',
    menteeName: '김**',
    category: 'PERSONAL_STATEMENT',
    durationMin: 60,
    amount: 60000,
    status: 'PAID',
  },
];

afterEach(() => {
  queryState = { data: undefined, isLoading: false };
});

describe('SettlementPage', () => {
  it('기간별 합계와 개별 정산 내역을 함께 렌더한다', () => {
    queryState = { data: { settlementList, itemList }, isLoading: false };
    render(<SettlementPage />);

    // 기간별 합계
    expect(screen.getByText('2026-06')).toBeInTheDocument();
    expect(screen.getByText('18건')).toBeInTheDocument();
    expect(screen.getByText('1,080,000원')).toBeInTheDocument();
    // 개별 정산 내역
    expect(screen.getByText('개별 정산 내역')).toBeInTheDocument();
    expect(screen.getByText('2026-06-28')).toBeInTheDocument();
    expect(screen.getByText('김**')).toBeInTheDocument();
    expect(screen.getByText('자기소개서')).toBeInTheDocument();
    expect(screen.getByText('60,000원')).toBeInTheDocument();
  });

  it('데이터가 없으면 각 표에 빈 상태 문구를 노출한다', () => {
    queryState = {
      data: { settlementList: [], itemList: [] },
      isLoading: false,
    };
    render(<SettlementPage />);

    expect(screen.getByText('정산 내역이 없습니다.')).toBeInTheDocument();
    expect(screen.getByText('개별 정산 내역이 없습니다.')).toBeInTheDocument();
  });

  it('로딩 중에는 로딩 문구를 노출한다', () => {
    queryState = { data: undefined, isLoading: true };
    render(<SettlementPage />);

    expect(screen.getAllByText('불러오는 중...').length).toBeGreaterThan(0);
  });
});
