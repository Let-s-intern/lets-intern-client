import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { OpenStatusRow } from '@/api/live-mentoring/liveMentoringSchema';

let queryState: { data?: OpenStatusRow[]; isLoading: boolean } = {
  data: undefined,
  isLoading: false,
};

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringOpenStatusQuery: () => queryState,
}));

import OpenStatusPage from '../OpenStatusPage';

const rows: OpenStatusRow[] = [
  {
    category: 'PERSONAL_STATEMENT',
    durationMin: 50,
    price: 60000,
    status: 'OPEN',
    reservationCount: 7,
  },
  {
    category: 'PORTFOLIO',
    durationMin: 30,
    price: 35000,
    status: 'CLOSED',
    reservationCount: 0,
  },
];

afterEach(() => {
  queryState = { data: undefined, isLoading: false };
});

describe('OpenStatusPage', () => {
  it('오픈 현황행을 카테고리 한글 라벨과 함께 렌더한다', () => {
    queryState = { data: rows, isLoading: false };
    render(<OpenStatusPage />);

    expect(screen.getByText('자기소개서')).toBeInTheDocument();
    expect(screen.getByText('포트폴리오')).toBeInTheDocument();
    expect(screen.getByText('50분')).toBeInTheDocument();
    expect(screen.getByText('60,000원')).toBeInTheDocument();
    expect(screen.getByText('7건')).toBeInTheDocument();
  });

  it('상태 뱃지(오픈중/마감)를 노출한다', () => {
    queryState = { data: rows, isLoading: false };
    render(<OpenStatusPage />);

    expect(screen.getByText('오픈중')).toBeInTheDocument();
    expect(screen.getByText('마감')).toBeInTheDocument();
  });

  it('데이터가 없으면 빈 상태 문구를 노출한다', () => {
    queryState = { data: [], isLoading: false };
    render(<OpenStatusPage />);

    expect(screen.getByText('오픈한 멘토링이 없습니다.')).toBeInTheDocument();
  });
});
