import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { buildRefundConfirmSentence } from '../../utils/refundConfirm';
import RefundModal, { RefundTarget } from '../RefundModal';

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
  submittedMissionCount: 3,
};

const deleteCheckbox = () =>
  screen.getByRole('checkbox', { name: '참여자를 목록에서 완전히 삭제' });

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
  await user.type(confirmInput(), currentSentence());
};

/** 화면이 제시하는 확인 문장. 실행 버튼 바로 위에 그대로 적혀 있다. */
const currentSentence = () =>
  screen.getByText(/이 유저를|이 유저에게/).textContent ?? '';

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

    await setAmount(user, '330001');
    await fillRequiredFields(user);

    expect(
      screen.getByText('실결제액 330,000원을 넘을 수 없습니다.'),
    ).toBeInTheDocument();
    expect(submitButton()).toBeDisabled();
  });

  it('상한과 같은 금액은 실행할 수 있다', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderModal();

    await setAmount(user, '330000');
    await fillRequiredFields(user);
    await user.click(submitButton());

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ refundAmount: 330000 }),
    );
  });

  it('0원 환불은 실행을 막는다', async () => {
    // 토스가 cancelAmount 0 을 조용히 무시해 돈이 나가지 않은 채 성공이 된다.
    const user = userEvent.setup();
    renderModal();

    await setAmount(user, '0');
    await fillRequiredFields(user);

    expect(
      screen.getByText('환불 금액은 1원 이상이어야 합니다.'),
    ).toBeInTheDocument();
    expect(submitButton()).toBeDisabled();
  });

  it('금액이 비어도 실행을 막는다', async () => {
    const user = userEvent.setup();
    renderModal();

    await setAmount(user, '');
    await fillRequiredFields(user);

    expect(submitButton()).toBeDisabled();
  });

  it('1원은 실행할 수 있다', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderModal();

    await setAmount(user, '1');
    await fillRequiredFields(user);
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

describe('RefundModal 확인 문장', () => {
  it('전액이면 전체 환불 문장을 요구한다', () => {
    renderModal();

    expect(
      screen.getByText(
        '이 유저를 전체 환불 시킵니다. 이 유저는 대시보드에 입장할 수 없습니다.',
      ),
    ).toBeInTheDocument();
  });

  it('부분이면 금액이 들어간 문장으로 바뀐다', async () => {
    // 문장이 실제 결과와 다르면 확인 절차가 무의미해진다.
    const user = userEvent.setup();
    renderModal();

    await setAmount(user, '220000');

    expect(
      screen.getByText(
        '이 유저에게 220,000원을 환불합니다. 이 유저는 대시보드에 입장할 수 없습니다.',
      ),
    ).toBeInTheDocument();
  });

  it('금액을 바꾸면 이전 문장으로는 실행할 수 없다', async () => {
    const user = userEvent.setup();
    renderModal();

    await fillRequiredFields(user);
    expect(submitButton()).toBeEnabled();

    await setAmount(user, '220000');
    expect(submitButton()).toBeDisabled();
  });
});

describe('RefundModal 완전 삭제 체크박스', () => {
  it('기본은 꺼짐이고 주의 문구를 띄우지 않는다', () => {
    // 꺼진 상태에서 시선을 끌면 정작 켰을 때의 경고가 묻힌다.
    renderModal();

    expect(deleteCheckbox()).not.toBeChecked();
    expect(screen.queryByText(/되돌릴 수 없고/)).not.toBeInTheDocument();
  });

  it('켜면 무엇이 지워지는지 세 줄로 알린다', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(deleteCheckbox());

    expect(
      screen.getByText(
        '신청 기록·결제 기록·제출한 미션 3건이 함께 지워집니다.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('되돌릴 수 없고 환불 히스토리에만 남습니다.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '환불한 뒤에는 이 창을 다시 열 수 없어 나중에 삭제할 수 없습니다.',
      ),
    ).toBeInTheDocument();
  });

  it('제출물 건수를 모르면 건수 없이 알린다', async () => {
    const user = userEvent.setup();
    renderModal({ submittedMissionCount: null });

    await user.click(deleteCheckbox());

    expect(
      screen.getByText('신청 기록·결제 기록·제출한 미션이 함께 지워집니다.'),
    ).toBeInTheDocument();
  });

  it('끈 채로 실행하면 hardDelete 를 false 로 보낸다', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderModal();

    await fillRequiredFields(user);
    await user.click(submitButton());

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ hardDelete: false }),
    );
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

    await user.type(confirmInput(), FULL_SENTENCE);
    expect(submitButton()).toBeDisabled();

    await user.type(screen.getByLabelText('담당자'), '임호정');
    expect(submitButton()).toBeDisabled();

    await user.type(screen.getByLabelText('환불 사유'), '프로그램 오결제');
    expect(submitButton()).toBeEnabled();
  });
});
