import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type {
  LiveMentoringSettings,
  OpeningHistoryItem,
} from '@/api/live-mentoring/liveMentoringSchema';

let queryState: { data?: OpeningHistoryItem[]; isLoading: boolean } = {
  data: undefined,
  isLoading: false,
};
let settingsState: { data?: LiveMentoringSettings } = { data: undefined };

vi.mock('@/api/live-mentoring/liveMentoring', () => ({
  useLiveMentoringOpenStatusQuery: () => queryState,
  useLiveMentoringSettingsQuery: () => settingsState,
}));

import OpenStatusPage from '../OpenStatusPage';

const rows: OpeningHistoryItem[] = [
  {
    openingId: 12,
    status: 'OPEN',
    durationPrices: [
      { duration: 30, price: 35000 },
      { duration: 60, price: 60000 },
    ],
    feedbackStartDate: '2026-07-14',
    feedbackEndDate: '2026-07-28',
    openedAt: '2026-07-14T09:00:00',
    closedAt: null,
    closeReason: null,
  },
  {
    openingId: 11,
    status: 'CLOSED',
    durationPrices: [{ duration: 60, price: 60000 }],
    feedbackStartDate: '2026-07-11',
    feedbackEndDate: '2026-07-24',
    openedAt: '2026-07-11T09:00:00',
    closedAt: '2026-07-24T23:59:59',
    closeReason: 'PERIOD_EXPIRED',
  },
];

const settings: LiveMentoringSettings = {
  liveMentoringId: 1,
  nickname: '멘토',
  profileImage: null,
  introduction: null,
  careers: [],
  title: '자소서 실전 첨삭 멘토링',
  status: 'APPROVED',
  categories: ['PERSONAL_STATEMENT'],
};

afterEach(() => {
  queryState = { data: undefined, isLoading: false };
  settingsState = { data: undefined };
});

describe('OpenStatusPage', () => {
  it('개설 이력 행을 durationPrices 기준으로 렌더한다', () => {
    queryState = { data: rows, isLoading: false };
    render(<OpenStatusPage />);

    expect(screen.getByText('30분·60분')).toBeInTheDocument();
    expect(screen.getByText('60분')).toBeInTheDocument();
  });

  // 진행시간이 여러 개면 최저가에 "최저" 접두를, 하나면 그 가격만 표기한다.
  it('진행시간 개수에 따라 가격 표기를 나눈다', () => {
    queryState = { data: rows, isLoading: false };
    render(<OpenStatusPage />);

    expect(screen.getByText('최저 35,000원')).toBeInTheDocument();
    expect(screen.getByText('60,000원')).toBeInTheDocument();
  });

  // 서버가 예약 수를 더 이상 주지 않는다. 열도 안내 문구도 남아 있으면 안 된다.
  it('예약 수 열을 노출하지 않는다', () => {
    queryState = { data: rows, isLoading: false };
    render(<OpenStatusPage />);

    expect(screen.getAllByRole('columnheader')).toHaveLength(4);
    expect(screen.queryByText('예약 수')).not.toBeInTheDocument();
    expect(
      screen.queryByText(/예약 수는 예약 시스템 연동 전까지/),
    ).not.toBeInTheDocument();
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

  // 타이틀·카테고리는 상품 값이라 개설이 2건이어도 요약 한 줄에만 나와야 한다.
  // 행마다 반복하면 과거 개설에 현재 제목이 붙는다.
  it('상품 타이틀과 카테고리를 표 상단 요약에 한 번만 노출한다', () => {
    queryState = { data: rows, isLoading: false };
    settingsState = { data: settings };
    render(<OpenStatusPage />);

    expect(screen.getAllByText('자소서 실전 첨삭 멘토링')).toHaveLength(1);
    expect(screen.getAllByText('자기소개서')).toHaveLength(1);
  });

  it('상품이 없으면 요약 대신 오픈 설정 안내를 노출한다', () => {
    queryState = { data: [], isLoading: false };
    settingsState = {
      data: { ...settings, liveMentoringId: null, title: null },
    };
    render(<OpenStatusPage />);

    expect(
      screen.getByText(
        '아직 만들어진 상품이 없습니다. 오픈 설정에서 타이틀과 타입을 먼저 저장해주세요.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('자기소개서')).not.toBeInTheDocument();
  });
});
