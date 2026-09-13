import { PlanChangeInfo } from '@/api/planChange';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import PlanChangeModal from '../PlanChangeModal';

const { planChangeQuery } = vi.hoisted(() => ({
  planChangeQuery: vi.fn(),
}));

vi.mock('@/api/planChange', () => ({
  usePlanChangeQuery: (...args: unknown[]) => planChangeQuery(...args),
}));

const info: PlanChangeInfo = {
  currentPlan: 'BASIC',
  // 서버가 상위만 준다는 계약이지만, 섞여 와도 화면이 거르는지 본다
  options: [
    { planType: 'LIGHT', title: null, salePrice: 50000, calculatedAmount: 0 },
    {
      planType: 'STANDARD',
      title: null,
      salePrice: 150000,
      calculatedAmount: 50000,
    },
    {
      planType: 'PREMIUM',
      title: null,
      salePrice: 200000,
      calculatedAmount: 100000,
    },
  ],
  logs: [],
};

const renderModal = (isSubmitting = false) => {
  const onSubmit = vi.fn();
  const onClose = vi.fn();
  render(
    <PlanChangeModal
      target={{
        applicationId: 7,
        name: '김렛츠',
        programTitle: '자소서 챌린지',
      }}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      onClose={onClose}
    />,
  );
  return { onSubmit, onClose, user: userEvent.setup() };
};

const planBox = () => screen.getByRole('combobox', { name: '변경할 플랜' });
const amountInput = () => screen.getByRole('textbox', { name: '수납 금액' });
const submitButton = () => screen.getByRole('button', { name: '변경' });

const choosePlan = async (
  user: ReturnType<typeof userEvent.setup>,
  name: string,
) => {
  await user.click(planBox());
  await user.click(
    within(screen.getByRole('listbox')).getByRole('option', { name }),
  );
};

const fillManagerAndReason = async (
  user: ReturnType<typeof userEvent.setup>,
) => {
  await user.type(
    screen.getByPlaceholderText('플랜을 변경하는 담당자 이름'),
    '홍길동',
  );
  await user.type(
    screen.getByPlaceholderText('예: 9/12 계좌이체 입금 확인'),
    '9/12 계좌이체 입금 확인',
  );
};

describe('PlanChangeModal', () => {
  beforeEach(() => {
    planChangeQuery.mockReset();
    planChangeQuery.mockReturnValue({
      data: info,
      isLoading: false,
      isError: false,
    });
  });

  it('신청 id 로 조회하고 현재 플랜을 보여준다', () => {
    renderModal();

    expect(planChangeQuery).toHaveBeenCalledWith(7);
    expect(screen.getByText('베이직')).toBeInTheDocument();
    expect(screen.getByText('자소서 챌린지')).toBeInTheDocument();
  });

  it('현재보다 높은 플랜만 계산 차액과 함께 고를 수 있다', async () => {
    const { user } = renderModal();

    await user.click(planBox());
    const options = within(screen.getByRole('listbox'))
      .getAllByRole('option')
      .map((option) => option.textContent);

    expect(options).toEqual([
      '플랜 선택',
      '스탠다드 (차액 50,000원)',
      '프리미엄 (차액 100,000원)',
    ]);
  });

  it('플랜을 고르면 수납 금액이 계산값으로 채워진다', async () => {
    const { user } = renderModal();

    await choosePlan(user, '프리미엄 (차액 100,000원)');

    expect(amountInput()).toHaveValue('100,000');
    expect(screen.getByText('100,000원')).toBeInTheDocument();
    expect(screen.queryByText(/과 다릅니다/)).not.toBeInTheDocument();
  });

  it('수납 금액을 고치면 계산값과 다르다고 알린다', async () => {
    const { user } = renderModal();

    await choosePlan(user, '프리미엄 (차액 100,000원)');
    await user.clear(amountInput());
    await user.type(amountInput(), '80000');

    expect(screen.getByText('계산값 100,000원과 다릅니다')).toBeInTheDocument();
  });

  it('담당자 이름과 사유가 없으면 변경이 비활성이다', async () => {
    const { user } = renderModal();

    await choosePlan(user, '프리미엄 (차액 100,000원)');
    expect(submitButton()).toBeDisabled();

    await user.type(
      screen.getByPlaceholderText('플랜을 변경하는 담당자 이름'),
      '홍길동',
    );
    expect(submitButton()).toBeDisabled();

    await user.type(
      screen.getByPlaceholderText('예: 9/12 계좌이체 입금 확인'),
      '입금 확인',
    );
    expect(submitButton()).toBeEnabled();
  });

  it('요청 중이면 변경과 취소가 비활성이다', async () => {
    const { user } = renderModal(true);

    await choosePlan(user, '프리미엄 (차액 100,000원)');
    await fillManagerAndReason(user);

    expect(submitButton()).toBeDisabled();
    expect(screen.getByRole('button', { name: '취소' })).toBeDisabled();
  });

  it('확인 문장에 이름·현재·대상·수납 금액이 들어간다', async () => {
    const { user } = renderModal();

    await choosePlan(user, '스탠다드 (차액 50,000원)');
    await user.clear(amountInput());
    await user.type(amountInput(), '40000');

    expect(
      screen.getByText(
        '김렛츠님을 베이직에서 스탠다드로 변경하고 추가 수납 40,000원을 기록합니다',
      ),
    ).toBeInTheDocument();
  });

  it('수납 금액이 계산값과 같으면 additionalAmount 를 null 로 보낸다', async () => {
    const { onSubmit, user } = renderModal();

    await choosePlan(user, '프리미엄 (차액 100,000원)');
    await fillManagerAndReason(user);
    await user.click(submitButton());

    expect(onSubmit).toHaveBeenCalledWith({
      toPlan: 'PREMIUM',
      additionalAmount: null,
      managerName: '홍길동',
      reason: '9/12 계좌이체 입금 확인',
    });
  });

  it('수납 금액을 고쳤으면 고친 금액을 보낸다', async () => {
    const { onSubmit, user } = renderModal();

    await choosePlan(user, '프리미엄 (차액 100,000원)');
    await user.clear(amountInput());
    await user.type(amountInput(), '80000');
    await fillManagerAndReason(user);
    await user.click(submitButton());

    expect(onSubmit).toHaveBeenCalledWith({
      toPlan: 'PREMIUM',
      additionalAmount: 80000,
      managerName: '홍길동',
      reason: '9/12 계좌이체 입금 확인',
    });
  });
});
