import type { UserAdminDetail } from '@/schema';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PurchaseHistorySection from '../PurchaseHistorySection';

vi.mock('@/utils/axios', () => ({ default: {} }));
vi.mock('@/utils/axiosV2', () => ({ default: {} }));

const baseData = {
  userInfo: { id: '7', name: '김유저', email: 'u@test.com', phoneNum: '010' },
  applicationInfo: [{ programId: 1, programTitle: '옛 챌린지' }],
} as unknown as UserAdminDetail;

const withDetail = (
  applicationDetailInfo: NonNullable<UserAdminDetail['applicationDetailInfo']>,
): UserAdminDetail => ({ ...baseData, applicationDetailInfo });

describe('PurchaseHistorySection', () => {
  it('상세가 없으면 기존 제목 목록으로 폴백한다', () => {
    render(<PurchaseHistorySection data={baseData} />);
    expect(screen.getByText('옛 챌린지')).toBeInTheDocument();
    expect(screen.queryByText(/^참여중/)).not.toBeInTheDocument();
  });

  it('상세가 빈 목록이어도 폴백한다', () => {
    render(<PurchaseHistorySection data={withDetail([])} />);
    expect(screen.getByText('옛 챌린지')).toBeInTheDocument();
  });

  it('상세도 제목도 없으면 신청 내역 없음을 보인다', () => {
    render(
      <PurchaseHistorySection
        data={{ ...baseData, applicationInfo: [] } as UserAdminDetail}
      />,
    );
    expect(screen.getByText('신청 내역이 없습니다.')).toBeInTheDocument();
  });

  it('참여중과 참여했던 묶음으로 나누고 상태와 값을 글자로 보인다', () => {
    render(
      <PurchaseHistorySection
        data={withDetail([
          {
            applicationId: 1,
            programType: 'CHALLENGE',
            programTitle: '진행 중 챌린지',
            programStartDate: '2000-01-01T00:00:00',
            programEndDate: '2999-01-01T00:00:00',
            orderId: 'ORDER-1',
            programPrice: 100000,
            couponName: '전액 쿠폰',
            couponDiscount: -1,
            finalPrice: 0,
            challengePricePlanType: 'PREMIUM',
            additionalPaidAmount: 5000,
          },
          {
            applicationId: 2,
            programType: 'LIVE',
            programTitle: '환불한 라이브',
            isCanceled: true,
          },
        ])}
      />,
    );

    const current = screen.getByRole('heading', { name: '참여중 (1)' })
      .parentElement as HTMLElement;
    expect(within(current).getByText('진행 중 챌린지')).toBeInTheDocument();
    expect(within(current).getByText('진행 중')).toBeInTheDocument();
    expect(within(current).getByText('ORDER-1')).toBeInTheDocument();
    expect(within(current).getByText('100,000원')).toBeInTheDocument();
    expect(
      within(current).getByText('전액 쿠폰 (100% 할인)'),
    ).toBeInTheDocument();
    expect(within(current).getByText('프리미엄')).toBeInTheDocument();
    expect(within(current).getByText('5,000원')).toBeInTheDocument();

    const past = screen.getByRole('heading', { name: '참여했던 (1)' })
      .parentElement as HTMLElement;
    expect(within(past).getByText('환불한 라이브')).toBeInTheDocument();
    expect(within(past).getByText('환불·취소됨')).toBeInTheDocument();
  });
});
