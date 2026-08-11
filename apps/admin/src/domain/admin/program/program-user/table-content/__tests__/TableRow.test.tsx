import dayjs from '@/lib/dayjs';
import { ChallengeApplication } from '@/schema';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
) => {
  const onRefundClick = vi.fn();
  render(
    <table>
      <tbody>
        <TableRow
          applicationItem={item}
          programType="CHALLENGE"
          programTitle="[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기"
          adminRefundedIds={adminRefundedIds}
          onRefundClick={onRefundClick}
        />
      </tbody>
    </table>,
  );
  return { onRefundClick };
};

const fullButton = () => screen.getByRole('button', { name: '환불' });
const partialButton = () => screen.getByRole('button', { name: '부분환불' });

describe('TableRow 환불 액션', () => {
  it('전체 환불과 부분 환불을 각각 누를 수 있다', () => {
    // 두 요청이 서로 다르다. 전체는 금액을 보내지 않고 서버가 실결제액을 쓴다.
    renderRow(application());

    expect(fullButton()).toBeInTheDocument();
    expect(partialButton()).toBeEnabled();
  });

  it('누른 버튼에 맞는 모드를 넘긴다', async () => {
    const user = userEvent.setup();
    const { onRefundClick } = renderRow(application());

    await user.click(fullButton());
    expect(onRefundClick).toHaveBeenLastCalledWith(
      expect.objectContaining({ applicationId: 5001 }),
      'full',
    );

    await user.click(partialButton());
    expect(onRefundClick).toHaveBeenLastCalledWith(
      expect.objectContaining({ applicationId: 5001 }),
      'partial',
    );
  });

  it('0원 결제는 전체 환불만 누를 수 있다', () => {
    // 100% 할인 쿠폰과 어드민 테스트 참여. 나눌 금액이 없다.
    renderRow(application({ finalPrice: 0 }));

    expect(fullButton()).toBeEnabled();
    expect(partialButton()).toBeDisabled();
  });

  it('어드민 테스트 참여도 환불할 수 있다', () => {
    // 0원 결제라 PG 호출 없이 참여만 취소된다. 예전에는 주문번호로 막았는데
    // 그러면 테스트 참여를 어드민에서 정리할 방법이 없었다.
    renderRow(application({ orderId: 'TEST_CHALLENGE_5001', finalPrice: 0 }));

    expect(fullButton()).toBeEnabled();
    expect(screen.queryByText('테스트 결제')).not.toBeInTheDocument();
  });

  it('참여자 정보가 없는 고아 신청서는 버튼 대신 사유를 보여준다', () => {
    // 서버가 알림톡·감사 로그 스냅샷에 user 를 써서 그대로 실행하면 NPE 가 난다.
    renderRow(application({ name: null }));

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('참여자 정보 없음')).toBeInTheDocument();
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

  it('0원 결제 취소는 전체 환불로 표시한다', () => {
    renderRow(
      application({ isCanceled: true, finalPrice: 0, originalPrice: 0 }),
      new Set([5001]),
    );

    expect(screen.getByText('어드민 전체 환불')).toBeInTheDocument();
  });
});
