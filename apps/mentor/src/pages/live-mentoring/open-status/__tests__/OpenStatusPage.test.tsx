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
    categories: ['PERSONAL_STATEMENT'],
    durations: [50],
    price: 60000,
    feedbackStartDate: '2026-07-14',
    feedbackEndDate: '2026-07-28',
    status: 'OPEN',
    reservationCount: 7,
  },
  {
    categories: ['PORTFOLIO'],
    durations: [30],
    price: 35000,
    feedbackStartDate: '2026-07-11',
    feedbackEndDate: '2026-07-24',
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

  // 이전에는 "{시작} ~" 와 "{종료}" 가 별도 텍스트 노드라 좁은 열에서 중간이 끊겼다.
  // 한 덩어리로 렌더되는지(= 끊기지 않는지) 고정한다.
  it('피드백 기간을 끊기지 않는 한 덩어리로 렌더한다', () => {
    queryState = { data: rows, isLoading: false };
    render(<OpenStatusPage />);

    expect(screen.getByText('07-14 ~ 07-28')).toBeInTheDocument();
    expect(screen.getByText('07-11 ~ 07-24')).toBeInTheDocument();
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
