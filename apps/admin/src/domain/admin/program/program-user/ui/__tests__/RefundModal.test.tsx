import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import RefundModal, { CONFIRM_SENTENCE, RefundTarget } from '../RefundModal';

const target: RefundTarget = {
  applicationId: 5001,
  name: '박서현',
  email: 'seohyun@example.com',
  phoneNum: '010-0000-0000',
  programTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
  orderId: 'letsBX385104',
  pricePlanType: 'BASIC',
  couponName: null,
  couponDiscount: null,
  finalPrice: 330000,
};

const renderModal = (over: Partial<RefundTarget> = {}) => {
  const onSubmit = vi.fn();
  render(
    <RefundModal
      target={{ ...target, ...over }}
      isSubmitting={false}
      onSubmit={onSubmit}
      onClose={vi.fn()}
    />,
  );
  return { onSubmit };
};

const amountInput = () => screen.getByLabelText('환불 금액');
const submitButton = () => screen.getByRole('button', { name: '환불 실행' });
const confirmInput = () => screen.getByLabelText('확인 문장');

/** 금액 외 조건을 모두 채운다. 금액 검증만 남긴다. */
const fillRequiredFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('담당자'), '임호정');
  await user.type(screen.getByLabelText('환불 사유'), '프로그램 오결제');
  await user.type(confirmInput(), CONFIRM_SENTENCE);
};

const setAmount = async (
  user: ReturnType<typeof userEvent.setup>,
  value: string,
) => {
  await user.clear(amountInput());
  if (value) await user.type(amountInput(), value);
};

describe('RefundModal 환불 금액', () => {
  it('기본값은 실결제액이다', () => {
    renderModal();

    expect(amountInput()).toHaveValue('330,000');
  });

  it('상한만 보여주고 규정상 환불액은 계산하지 않는다', () => {
    // 어드민 환불은 규정 밖 작업이라 규정값이 판단 근거가 되지 않는다.
    renderModal();

    expect(
      screen.getByText('최대 330,000원까지 환불할 수 있습니다.'),
    ).toBeInTheDocument();
  });

  it('전액 버튼이 상한을 한 번에 채운다', async () => {
    const user = userEvent.setup();
    renderModal();

    await setAmount(user, '100000');
    await user.click(screen.getByRole('button', { name: '전액' }));

    expect(amountInput()).toHaveValue('330,000');
  });

  it('실결제액을 넘는 금액은 실행을 막는다', async () => {
    const user = userEvent.setup();
    renderModal();

    await fillRequiredFields(user);
    await setAmount(user, '330001');

    expect(
      screen.getByText('실결제액 330,000원을 넘을 수 없습니다.'),
    ).toBeInTheDocument();
    expect(submitButton()).toBeDisabled();
  });

  it('상한과 같은 금액은 실행할 수 있다', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderModal();

    await fillRequiredFields(user);
    await setAmount(user, '330000');
    await user.click(submitButton());

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ refundAmount: 330000 }),
    );
  });

  it('0원 환불은 실행을 막는다', async () => {
    // 토스가 cancelAmount 0 을 조용히 무시해 돈이 나가지 않은 채 성공이 된다.
    const user = userEvent.setup();
    renderModal();

    await fillRequiredFields(user);
    await setAmount(user, '0');

    expect(
      screen.getByText('환불 금액은 1원 이상이어야 합니다.'),
    ).toBeInTheDocument();
    expect(submitButton()).toBeDisabled();
  });

  it('금액이 비어도 실행을 막는다', async () => {
    const user = userEvent.setup();
    renderModal();

    await fillRequiredFields(user);
    await setAmount(user, '');

    expect(submitButton()).toBeDisabled();
  });

  it('1원은 실행할 수 있다', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderModal();

    await fillRequiredFields(user);
    await setAmount(user, '1');
    await user.click(submitButton());

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ refundAmount: 1 }),
    );
  });

  it('실결제액이 0원이면 환불할 수 없다', async () => {
    // 100% 할인 쿠폰 건. 0 을 허용하면 결제는 살아 있는데 참여만 끝나는 상태가 된다.
    const user = userEvent.setup();
    renderModal({ finalPrice: 0 });

    await fillRequiredFields(user);

    expect(submitButton()).toBeDisabled();
  });
});

describe('RefundModal 실행 조건', () => {
  it('확인 문장이 다르면 실행할 수 없다', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.type(screen.getByLabelText('담당자'), '임호정');
    await user.type(screen.getByLabelText('환불 사유'), '프로그램 오결제');
    await user.type(confirmInput(), '이 유저를 환불합니다.');

    expect(submitButton()).toBeDisabled();
  });

  it('담당자와 사유를 모두 채워야 실행할 수 있다', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.type(confirmInput(), CONFIRM_SENTENCE);
    expect(submitButton()).toBeDisabled();

    await user.type(screen.getByLabelText('담당자'), '임호정');
    expect(submitButton()).toBeDisabled();

    await user.type(screen.getByLabelText('환불 사유'), '프로그램 오결제');
    expect(submitButton()).toBeEnabled();
  });
});
