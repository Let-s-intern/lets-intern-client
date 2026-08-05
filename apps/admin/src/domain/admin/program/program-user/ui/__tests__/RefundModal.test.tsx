import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { buildRefundConfirmSentence } from '../../utils/refundConfirm';
import RefundModal, { RefundMode, RefundTarget } from '../RefundModal';

const FULL_SENTENCE = buildRefundConfirmSentence({
  isFullRefund: true,
  refundAmount: 330000,
});

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

const renderModal = (mode: RefundMode, over: Partial<RefundTarget> = {}) => {
  const onSubmit = vi.fn();
  render(
    <RefundModal
      target={{ ...target, ...over }}
      mode={mode}
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

const setAmount = async (
  user: ReturnType<typeof userEvent.setup>,
  value: string,
) => {
  await user.clear(amountInput());
  if (value) await user.type(amountInput(), value);
};

/**
 * 담당자·사유와 확인 문장을 채운다.
 *
 * 문장은 금액에 따라 달라지므로 화면에 떠 있는 문장을 그대로 옮겨 적는다.
 * 금액을 바꾼 뒤에 호출해야 한다.
 */
const fillRequiredFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('담당자'), '임호정');
  await user.type(screen.getByLabelText('환불 사유'), '프로그램 오결제');
  const sentence = currentSentence();
  if (sentence) await user.type(confirmInput(), sentence);
};

/**
 * 화면이 제시하는 확인 문장. 실행 버튼 바로 위에 그대로 적혀 있다.
 * 금액이 정해지기 전에는 문장이 걸리지 않으므로 빈 문자열이 된다.
 */
const currentSentence = () =>
  screen.queryByText(/이 유저를|이 유저에게/)?.textContent ?? '';

describe('RefundModal 전체 환불', () => {
  it('금액 입력을 두지 않는다', () => {
    // 서버가 payment.finalPrice 를 쓴다. 화면이 읽은 값과 어긋날 여지를 만들지 않는다.
    renderModal('full');

    expect(screen.queryByLabelText('환불 금액')).not.toBeInTheDocument();
    expect(screen.getByText('실결제액 전액을 환불합니다.')).toBeInTheDocument();
  });

  it('요청 바디에서 금액 키를 생략한다', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderModal('full');

    await fillRequiredFields(user);
    await user.click(submitButton());

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).not.toHaveProperty('refundAmount');
  });

  it('실결제액이 0원이면 PG 취소가 없다고 안내한다', () => {
    renderModal('full', { finalPrice: 0 });

    expect(
      screen.getByText('실결제액이 0원이라 PG 취소 없이 참여만 취소됩니다.'),
    ).toBeInTheDocument();
  });

  it('실결제액이 0원이어도 실행할 수 있다', async () => {
    // 서버가 PG 호출을 건너뛰고 참여만 취소한다. LC-3191 동작이다.
    const user = userEvent.setup();
    const { onSubmit } = renderModal('full', { finalPrice: 0 });

    await fillRequiredFields(user);
    await user.click(submitButton());

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('전체 환불 문장을 요구한다', () => {
    renderModal('full');

    expect(
      screen.getByText(
        '이 유저를 전체 환불 시킵니다. 이 유저는 대시보드에 입장할 수 없습니다.',
      ),
    ).toBeInTheDocument();
  });
});

describe('RefundModal 부분 환불 금액', () => {
  it('기본값이 비어 있다', () => {
    // 실결제액을 채워 두면 그 값이 곧 거절 대상(전액)이다.
    renderModal('partial');

    expect(amountInput()).toHaveValue('');
  });

  it('상한만 보여주고 규정상 환불액은 계산하지 않는다', () => {
    // 어드민 환불은 규정 밖 작업이라 규정값이 판단 근거가 되지 않는다.
    renderModal('partial');

    expect(
      screen.getByText('실결제액 330,000원보다 적은 금액을 입력하세요.'),
    ).toBeInTheDocument();
  });

  it('실결제액을 넘는 금액은 실행을 막는다', async () => {
    const user = userEvent.setup();
    renderModal('partial');

    await setAmount(user, '330001');
    await fillRequiredFields(user);

    expect(
      screen.getByText(
        '실결제액 330,000원보다 적어야 합니다. 전액이면 환불 버튼을 사용하세요.',
      ),
    ).toBeInTheDocument();
    expect(submitButton()).toBeDisabled();
  });

  it('실결제액과 같은 금액은 실행을 막는다', async () => {
    // 서버가 REFUND_AMOUNT_EQUALS_PAYMENT 로 거절한다. 전체 환불 버튼을 쓰라는 뜻이다.
    const user = userEvent.setup();
    renderModal('partial');

    await setAmount(user, '330000');
    await fillRequiredFields(user);

    expect(
      screen.getByText(
        '실결제액 330,000원보다 적어야 합니다. 전액이면 환불 버튼을 사용하세요.',
      ),
    ).toBeInTheDocument();
    expect(submitButton()).toBeDisabled();
  });

  it('상한보다 1원 적으면 실행할 수 있다', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderModal('partial');

    await setAmount(user, '329999');
    await fillRequiredFields(user);
    await user.click(submitButton());

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ refundAmount: 329999 }),
    );
  });

  it('0원 환불은 실행을 막는다', async () => {
    // 토스가 cancelAmount 0 을 조용히 무시해 돈이 나가지 않은 채 성공이 된다.
    const user = userEvent.setup();
    renderModal('partial');

    await setAmount(user, '0');
    await fillRequiredFields(user);

    expect(
      screen.getByText('환불 금액은 1원 이상이어야 합니다.'),
    ).toBeInTheDocument();
    expect(submitButton()).toBeDisabled();
  });

  it('금액이 비어도 실행을 막는다', async () => {
    const user = userEvent.setup();
    renderModal('partial');

    await fillRequiredFields(user);

    expect(submitButton()).toBeDisabled();
  });

  it('금액이 정해지기 전에는 확인 문장을 내걸지 않는다', async () => {
    // 빈 칸을 0 으로 읽어 "0원을 환불합니다"를 요구하면 실제 결과와 어긋난다.
    const user = userEvent.setup();
    renderModal('partial');

    expect(
      screen.getByText('환불 금액을 먼저 입력하세요.'),
    ).toBeInTheDocument();

    await setAmount(user, '220000');

    expect(
      screen.queryByText('환불 금액을 먼저 입력하세요.'),
    ).not.toBeInTheDocument();
  });

  it('1원은 실행할 수 있다', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderModal('partial');

    await setAmount(user, '1');
    await fillRequiredFields(user);
    await user.click(submitButton());

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ refundAmount: 1 }),
    );
  });
});

describe('RefundModal 확인 문장', () => {
  it('부분이면 금액이 들어간 문장으로 바뀐다', async () => {
    // 문장이 실제 결과와 다르면 확인 절차가 무의미해진다.
    const user = userEvent.setup();
    renderModal('partial');

    await setAmount(user, '220000');

    expect(
      screen.getByText(
        '이 유저에게 220,000원을 환불합니다. 이 유저는 대시보드에 입장할 수 없습니다.',
      ),
    ).toBeInTheDocument();
  });

  it('금액을 바꾸면 이전 문장으로는 실행할 수 없다', async () => {
    const user = userEvent.setup();
    renderModal('partial');

    await setAmount(user, '220000');
    await fillRequiredFields(user);
    expect(submitButton()).toBeEnabled();

    await setAmount(user, '110000');
    expect(submitButton()).toBeDisabled();
  });
});

describe('RefundModal 실행 조건', () => {
  it('확인 문장이 다르면 실행할 수 없다', async () => {
    const user = userEvent.setup();
    renderModal('full');

    await user.type(screen.getByLabelText('담당자'), '임호정');
    await user.type(screen.getByLabelText('환불 사유'), '프로그램 오결제');
    await user.type(confirmInput(), '이 유저를 환불합니다.');

    expect(submitButton()).toBeDisabled();
  });

  it('담당자와 사유를 모두 채워야 실행할 수 있다', async () => {
    const user = userEvent.setup();
    renderModal('full');

    await user.type(confirmInput(), FULL_SENTENCE);
    expect(submitButton()).toBeDisabled();

    await user.type(screen.getByLabelText('담당자'), '임호정');
    expect(submitButton()).toBeDisabled();

    await user.type(screen.getByLabelText('환불 사유'), '프로그램 오결제');
    expect(submitButton()).toBeEnabled();
  });
});
