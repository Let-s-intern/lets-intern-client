import { ApiError } from '@letscareer/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminSnackbarProvider } from '@/hooks/useAdminSnackbar';

const get = vi.fn();
const put = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    put: (...args: unknown[]) => put(...args),
  },
}));

import VodPassProductSettings from './VodPassProductSettings';

const product = {
  vodPassProductId: 1,
  title: 'VOD 이용권',
  price: 49000,
  additionalMonthPrice: 10000,
  durationDays: 30,
  isActive: true,
  maxPurchaseMonths: 3,
  maxTotalMonths: 12,
};

const CONFIRM_MESSAGE =
  '변경은 이후 구매에만 적용됩니다. 이미 구매한 이용권의 기간과 개월 수는 바뀌지 않습니다. 결제를 진행 중인 사용자는 이용권을 다시 선택하게 됩니다.';

const apiError = (code: string, message: string, status: number) =>
  new ApiError({
    code,
    message,
    status,
    endpoint: '/admin/vod-pass-product',
    method: 'GET',
  });

const renderPage = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <AdminSnackbarProvider>
        <VodPassProductSettings />
      </AdminSnackbarProvider>
    </QueryClientProvider>,
  );
};

const priceInput = () => screen.getByLabelText('기본 가격(원)');
const additionalInput = () => screen.getByLabelText('추가 월 가격(원)');
const daysInput = () => screen.getByLabelText('이용일수(일)');
const purchaseMonthsInput = () =>
  screen.getByLabelText('1회 최대 구매 개월 수(개월)');
const totalMonthsInput = () =>
  screen.getByLabelText('누적 최대 보유 개월 수(개월)');

/** 입력칸을 비우고 새 값을 넣는다. */
const fill = async (input: HTMLElement, value: string) => {
  const user = userEvent.setup();
  await user.clear(input);
  if (value !== '') await user.type(input, value);
};

let confirmSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
});

afterEach(() => {
  get.mockReset();
  put.mockReset();
  confirmSpy.mockRestore();
});

describe('VodPassProductSettings 조회', () => {
  it('제목과 판매 상태를 읽기 전용으로, 가격·추가 월 가격·이용일수를 입력칸에 채운다', async () => {
    get.mockResolvedValue({ data: { data: product } });

    renderPage();

    expect(await screen.findByText('VOD 이용권')).toBeInTheDocument();
    expect(screen.getByText('판매 중')).toBeInTheDocument();
    expect(priceInput()).toHaveValue(49000);
    expect(additionalInput()).toHaveValue(10000);
    expect(daysInput()).toHaveValue(30);
  });

  it('입력값으로 계산한 3개월 구매 예시를 보여주고 입력을 바꾸면 따라 바뀐다', async () => {
    get.mockResolvedValue({ data: { data: product } });

    renderPage();
    await screen.findByText('VOD 이용권');

    // 49,000 + 10,000 * 2 = 69,000원, 30일 * 3 = 90일
    expect(
      screen.getByText('예시: 3개월 구매 시 69,000원, 90일'),
    ).toBeInTheDocument();

    await fill(additionalInput(), '0');

    expect(
      screen.getByText('예시: 3개월 구매 시 49,000원, 90일'),
    ).toBeInTheDocument();
  });

  it('입력이 올바르지 않으면 예시를 숨긴다', async () => {
    get.mockResolvedValue({ data: { data: product } });

    renderPage();
    await screen.findByText('VOD 이용권');

    await fill(additionalInput(), '-1');

    expect(screen.queryByText(/예시: 3개월/)).not.toBeInTheDocument();
  });

  it('판매 중지 상품은 판매 중지로 표시한다', async () => {
    get.mockResolvedValue({
      data: { data: { ...product, isActive: false } },
    });

    renderPage();

    expect(await screen.findByText('판매 중지')).toBeInTheDocument();
  });

  it('상품이 없어 404 가 오면 빈 화면 대신 설정 확인 안내를 보여준다', async () => {
    get.mockRejectedValue(
      apiError(
        'VOD_PASS_PRODUCT_NOT_FOUND',
        'VOD 이용권 상품이 없습니다.',
        404,
      ),
    );

    renderPage();

    expect(
      await screen.findByText(
        '상품이 아직 생성되지 않았습니다. BE 배포 설정(vod-pass.initial-price)을 확인하세요',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('기본 가격(원)')).not.toBeInTheDocument();
  });

  it('다른 조회 실패는 서버 문구를 그대로 보여준다', async () => {
    get.mockRejectedValue(apiError('API_ERROR', '권한이 없습니다.', 403));

    renderPage();

    expect(await screen.findByText('권한이 없습니다.')).toBeInTheDocument();
  });
});

describe('VodPassProductSettings 저장', () => {
  beforeEach(() => {
    get.mockResolvedValue({ data: { data: product } });
  });

  it('확인 문구에 동의하면 바꾼 값으로 PUT 하고 성공을 알린다', async () => {
    put.mockResolvedValue({ data: { data: null } });
    const user = userEvent.setup();

    renderPage();
    await screen.findByText('VOD 이용권');

    await fill(priceInput(), '59000');
    await fill(additionalInput(), '5000');
    await fill(daysInput(), '60');
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(confirmSpy).toHaveBeenCalledWith(CONFIRM_MESSAGE);
    await waitFor(() =>
      expect(put).toHaveBeenCalledWith('/admin/vod-pass-product', {
        price: 59000,
        additionalMonthPrice: 5000,
        durationDays: 60,
        maxPurchaseMonths: 3,
        maxTotalMonths: 12,
      }),
    );
    expect(
      await screen.findByText('VOD 이용권 설정을 저장했습니다.'),
    ).toBeInTheDocument();
  });

  it('1회·누적 구매 개월 수 상한을 현재 값으로 보여주고 바꾼 값으로 저장한다', async () => {
    put.mockResolvedValue({ data: { data: null } });
    const user = userEvent.setup();

    renderPage();
    await screen.findByText('VOD 이용권');

    expect(purchaseMonthsInput()).toHaveValue(3);
    expect(totalMonthsInput()).toHaveValue(12);

    await fill(purchaseMonthsInput(), '6');
    await fill(totalMonthsInput(), '24');
    await user.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() =>
      expect(put).toHaveBeenCalledWith(
        '/admin/vod-pass-product',
        expect.objectContaining({ maxPurchaseMonths: 6, maxTotalMonths: 24 }),
      ),
    );
  });

  it('누적 상한이 1회 상한보다 작으면 저장하지 않고 안내한다', async () => {
    const user = userEvent.setup();

    renderPage();
    await screen.findByText('VOD 이용권');

    await fill(purchaseMonthsInput(), '6');
    await fill(totalMonthsInput(), '3');
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '누적 최대 보유 개월 수는 1회 최대 구매 개월 수 이상',
    );
    expect(put).not.toHaveBeenCalled();
  });

  it('누적 상한이 120개월을 넘으면 저장하지 않는다', async () => {
    const user = userEvent.setup();

    renderPage();
    await screen.findByText('VOD 이용권');

    await fill(totalMonthsInput(), '121');
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(put).not.toHaveBeenCalled();
  });

  it('확인 문구를 거절하면 저장하지 않는다', async () => {
    confirmSpy.mockReturnValue(false);
    const user = userEvent.setup();

    renderPage();
    await screen.findByText('VOD 이용권');

    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(put).not.toHaveBeenCalled();
  });

  it.each([
    ['0', '0'],
    ['음수', '-5'],
    ['소수', '1.5'],
    ['빈 값', ''],
  ])(
    '가격이 %s 이면 안내하고 확인창도 띄우지 않는다',
    async (_label, value) => {
      const user = userEvent.setup();

      renderPage();
      await screen.findByText('VOD 이용권');

      await fill(priceInput(), value);
      await user.click(screen.getByRole('button', { name: '저장' }));

      expect(
        screen.getByText('가격은 1원 이상의 정수로 입력해 주세요.'),
      ).toBeInTheDocument();
      expect(confirmSpy).not.toHaveBeenCalled();
      expect(put).not.toHaveBeenCalled();
    },
  );

  it.each([
    ['0', '0'],
    ['음수', '-1'],
    ['소수', '2.5'],
  ])('이용일수가 %s 이면 안내하고 저장하지 않는다', async (_label, value) => {
    const user = userEvent.setup();

    renderPage();
    await screen.findByText('VOD 이용권');

    await fill(daysInput(), value);
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(
      screen.getByText('이용일수는 1일 이상의 정수로 입력해 주세요.'),
    ).toBeInTheDocument();
    expect(put).not.toHaveBeenCalled();
  });

  it('추가 월 가격 0 은 허용하고 그대로 보낸다', async () => {
    put.mockResolvedValue({ data: { data: null } });
    const user = userEvent.setup();

    renderPage();
    await screen.findByText('VOD 이용권');

    await fill(additionalInput(), '0');
    await user.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() =>
      expect(put).toHaveBeenCalledWith('/admin/vod-pass-product', {
        price: 49000,
        additionalMonthPrice: 0,
        durationDays: 30,
        maxPurchaseMonths: 3,
        maxTotalMonths: 12,
      }),
    );
  });

  it.each([
    ['음수', '-1'],
    ['소수', '0.5'],
    ['빈 값', ''],
  ])(
    '추가 월 가격이 %s 이면 안내하고 저장하지 않는다',
    async (_label, value) => {
      const user = userEvent.setup();

      renderPage();
      await screen.findByText('VOD 이용권');

      await fill(additionalInput(), value);
      await user.click(screen.getByRole('button', { name: '저장' }));

      expect(
        screen.getByText('추가 월 가격은 0원 이상의 정수로 입력해 주세요.'),
      ).toBeInTheDocument();
      expect(confirmSpy).not.toHaveBeenCalled();
      expect(put).not.toHaveBeenCalled();
    },
  );

  it('저장이 실패하면 서버 문구를 알린다', async () => {
    put.mockRejectedValue(
      apiError(
        'VOD_PASS_PRODUCT_SETTING_INVALID',
        '이용권 가격과 이용일수는 1 이상이어야 합니다.',
        400,
      ),
    );
    const user = userEvent.setup();

    renderPage();
    await screen.findByText('VOD 이용권');

    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(
      await screen.findByText('이용권 가격과 이용일수는 1 이상이어야 합니다.'),
    ).toBeInTheDocument();
  });
});
