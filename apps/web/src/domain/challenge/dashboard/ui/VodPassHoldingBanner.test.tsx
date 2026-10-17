import type { VodPass } from '@/api/vodPass';
import { render, screen } from '@testing-library/react';
import VodPassHoldingBanner from './VodPassHoldingBanner';

let mockHolding: {
  current: VodPass;
  endsAt: string;
  hasScheduled: boolean;
} | null = null;

jest.mock('@/domain/vod-pass/useVodPassHolding', () => ({
  __esModule: true,
  useVodPassHolding: () => mockHolding,
}));

const current: VodPass = {
  applicationId: 1,
  paymentId: 10,
  startsAt: '2026-10-16T10:00:00+09:00',
  endsAt: '2027-01-14T10:00:00+09:00',
  status: 'ACTIVE',
  paidAmount: 40000,
  refundable: false,
  durationDays: 90,
  purchasedMonths: 3,
};

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(new Date('2026-11-01T12:00:00+09:00'));
  mockHolding = null;
});

afterEach(() => {
  jest.useRealTimers();
});

describe('VodPassHoldingBanner (챌린지 대시보드)', () => {
  it('보유 중이 아니면 아무것도 그리지 않는다', () => {
    const { container } = render(<VodPassHoldingBanner />);

    expect(container).toBeEmptyDOMElement();
  });

  it('보유 중이면 보유 중 표시와 남은 기간, 이용 기간을 보여준다', () => {
    mockHolding = {
      current,
      endsAt: current.endsAt as string,
      hasScheduled: false,
    };

    render(<VodPassHoldingBanner />);

    expect(screen.getByText('VOD 이용권 보유 중')).toBeInTheDocument();
    expect(screen.getByText('2개월 13일 남음')).toBeInTheDocument();
    expect(
      screen.getByText('2026.10.16 ~ 2027.01.14 이용 가능'),
    ).toBeInTheDocument();
  });

  it('예약된 이용권이 이어져 있으면 마지막 종료일까지 보여주고 예약 포함을 알린다', () => {
    mockHolding = {
      current,
      endsAt: '2027-02-13T10:00:00+09:00',
      hasScheduled: true,
    };

    render(<VodPassHoldingBanner />);

    expect(screen.getByText('3개월 12일 남음')).toBeInTheDocument();
    expect(
      screen.getByText(
        /2026\.10\.16 ~ 2027\.02\.13 이용 가능 \(예약된 이용권 포함\)/,
      ),
    ).toBeInTheDocument();
  });
});
