import dayjs from '@/lib/dayjs';
import { ChallengeApplication } from '@/schema';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import TableRow from '../TableRow';

const application = (
  over: Partial<ChallengeApplication['application']> = {},
): ChallengeApplication =>
  ({
    application: {
      id: 5001,
      paymentId: 1,
      name: '박서현',
      email: 'seohyun@example.com',
      phoneNum: '010-0000-0000',
      couponName: null,
      couponDiscount: null,
      isCanceled: false,
      createDate: dayjs('2026-07-20T10:00:00'),
      orderId: 'letsBX385104',
      finalPrice: 330000,
      originalPrice: null,
      challengePricePlanType: 'BASIC',
      ...over,
    },
    optionPriceSum: 0,
    optionDiscountPriceSum: 0,
  }) as ChallengeApplication;

const renderRow = (
  item: ChallengeApplication,
  adminRefundedIds: Set<number> = new Set(),
) =>
  render(
    <table>
      <tbody>
        <TableRow
          applicationItem={item}
          programType="CHALLENGE"
          programTitle="[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기"
          adminRefundedIds={adminRefundedIds}
          onRefundClick={vi.fn()}
        />
      </tbody>
    </table>,
  );

describe('TableRow 환불 액션', () => {
  it('환불 버튼 라벨은 금액을 단정하지 않는다', () => {
    // 금액을 모달에서 지정하게 되어 목록 버튼이 전액을 약속할 수 없다.
    renderRow(application());

    expect(screen.getByRole('button', { name: '환불' })).toBeInTheDocument();
    expect(screen.queryByText('전액 환불')).not.toBeInTheDocument();
  });

  it('목록에 별도 삭제 액션을 두지 않는다', () => {
    // 삭제는 환불 모달 안에서만 선택한다. 목록에서 바로 지우면 결제가 살아 있는데
    // 참여 기록만 사라지는 상태가 만들어진다.
    renderRow(application());

    expect(screen.queryByText('삭제')).not.toBeInTheDocument();
  });

  it('이미 환불된 건은 버튼 대신 사유를 보여준다', () => {
    renderRow(application({ isCanceled: true }));

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('환불 완료')).toBeInTheDocument();
  });
});

describe('TableRow 환불여부 라벨', () => {
  it('어드민 부분 환불을 구분해 표시한다', () => {
    renderRow(
      application({
        isCanceled: true,
        finalPrice: 220000,
        originalPrice: 330000,
      }),
      new Set([5001]),
    );

    expect(screen.getByText('어드민 부분 환불')).toBeInTheDocument();
  });

  it('어드민 전체 환불을 구분해 표시한다', () => {
    renderRow(
      application({
        isCanceled: true,
        finalPrice: 330000,
        originalPrice: 330000,
      }),
      new Set([5001]),
    );

    expect(screen.getByText('어드민 전체 환불')).toBeInTheDocument();
  });

  it('환불 이력이 없는 취소 건은 유저 환불로 남는다', () => {
    renderRow(
      application({
        isCanceled: true,
        finalPrice: 220000,
        originalPrice: 330000,
      }),
    );

    expect(screen.getByText('유저 부분 환불')).toBeInTheDocument();
  });
});
