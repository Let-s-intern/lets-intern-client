import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError, AxiosHeaders } from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AdminOneTimeFormDetail } from '@/api/one-time-form/oneTimeFormSchema';
import { AdminSnackbarProvider } from '@/hooks/useAdminSnackbar';

import OneTimeFormEditor from './OneTimeFormEditor';
import { ZERO_PRICE_NOTICE } from './PaymentSettingsSection';

const createMutateAsync = vi.fn();
const updateMutateAsync = vi.fn();
const saveOptionGroupsMutateAsync = vi.fn();
const uploadFile = vi.fn();
const navigate = vi.fn();

vi.mock('@/api/one-time-form/oneTimeFormQueries', () => ({
  useCreateOneTimeFormMutation: () => ({
    mutateAsync: createMutateAsync,
    isPending: false,
  }),
  useUpdateOneTimeFormMutation: () => ({
    mutateAsync: updateMutateAsync,
    isPending: false,
  }),
  useSaveOneTimeFormQuestionsMutation: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useSaveOneTimeFormOptionGroupsMutation: () => ({
    mutateAsync: saveOptionGroupsMutateAsync,
    isPending: false,
  }),
}));

vi.mock('@/api/file', () => ({
  uploadFile: (...args: unknown[]) => uploadFile(...args),
}));

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
}));

const detail: AdminOneTimeFormDetail = {
  form: {
    formId: 7,
    title: '포트폴리오 집중 클래스',
    slug: 'portfolio-1115',
    categoryText: '일회성 클래스',
    scheduleText: '11.15(토) 14:00',
    thumbnailUrl: 'https://example.com/thumb.png',
    isVisible: true,
    startDate: '2026-11-01T00:00:00',
    endDate: '2026-11-10T23:59:59',
    cancelDeadline: null,
    isPaid: true,
    basePrice: 29000,
    paymentProductName: null,
    completionMessage: null,
    applicationCount: 3,
    isSlugLocked: true,
    createDate: '2026-10-20T10:00:00',
  },
  questions: [],
  optionGroups: [],
};

const renderEditor = (props: { detail?: AdminOneTimeFormDetail } = {}) =>
  render(
    <MemoryRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <AdminSnackbarProvider>
          <OneTimeFormEditor {...props} />
        </AdminSnackbarProvider>
      </LocalizationProvider>
    </MemoryRouter>,
  );

const selectThumbnail = (file: File) =>
  fireEvent.change(screen.getByLabelText('썸네일 파일'), {
    target: { files: [file] },
  });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('OneTimeFormEditor 기본 정보', () => {
  it('입력하는 대로 미리보기 카드가 바뀐다', async () => {
    renderEditor();
    // 썸네일 칸과 미리보기 카드 둘 다 기본 이미지다
    expect(screen.getAllByLabelText('기본 썸네일')).toHaveLength(2);

    await userEvent.type(
      screen.getByRole('textbox', { name: /폼 제목/ }),
      '새 클래스',
    );
    await userEvent.type(
      screen.getByRole('textbox', { name: '분류 문구' }),
      '특강',
    );

    const preview = screen.getByText('신청 화면 미리보기').parentElement;
    expect(preview).toHaveTextContent('특강');
    expect(preview).toHaveTextContent('새 클래스');
  });

  it('비어 있는 필수 칸은 저장하지 않고 칸 아래에 알린다', async () => {
    renderEditor();
    await userEvent.click(screen.getByRole('button', { name: '폼 만들기' }));

    expect(screen.getByText('폼 제목을 입력해 주세요.')).toBeInTheDocument();
    expect(screen.getByText('주소를 입력해 주세요.')).toBeInTheDocument();
    expect(createMutateAsync).not.toHaveBeenCalled();
  });

  it('2MB 를 넘거나 확장자가 다른 썸네일은 올리지 않는다', () => {
    renderEditor();

    const big = new File(['x'], 'big.png');
    Object.defineProperty(big, 'size', { value: 2 * 1024 * 1024 + 1 });
    selectThumbnail(big);
    expect(screen.getByRole('alert')).toHaveTextContent('2MB 이하');

    selectThumbnail(new File(['x'], 'anim.gif'));
    expect(screen.getByRole('alert')).toHaveTextContent('jpg, png, webp');

    expect(uploadFile).not.toHaveBeenCalled();
  });

  it('공개 중인 폼은 주소를 바꿀 수 없다고 보여 준다', () => {
    renderEditor({ detail });
    expect(screen.getByRole('textbox', { name: /주소/ })).toBeDisabled();
    expect(
      screen.getByText(
        /공개 중이거나 신청이 있는 폼은 주소를 바꿀 수 없습니다/,
      ),
    ).toBeInTheDocument();
    // 추가 금액 있는 옵션이 없으니 "부터" 가 붙지 않는다
    expect(screen.getByText('11.15(토) 14:00 · 29,000원')).toBeInTheDocument();
  });

  it('썸네일을 지우고 저장하면 thumbnailUrl 을 null 로 보낸다', async () => {
    updateMutateAsync.mockResolvedValue(undefined);
    renderEditor({ detail });

    await userEvent.click(screen.getByRole('button', { name: '삭제' }));
    await userEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(updateMutateAsync).toHaveBeenCalledWith({
      formId: 7,
      body: expect.objectContaining({
        thumbnailUrl: null,
        isPaid: true,
        basePrice: 29000,
        cancelDeadline: null,
      }),
    });
    expect(await screen.findByText('저장되었습니다.')).toBeInTheDocument();
  });

  it('서버가 주소 중복으로 거절하면 주소 칸에 알린다', async () => {
    updateMutateAsync.mockRejectedValue(
      new AxiosError('fail', '409', undefined, undefined, {
        status: 409,
        statusText: '',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: { status: 409, code: 'ONE_TIME_FORM_SLUG_DUPLICATED' },
      }),
    );
    renderEditor({ detail });

    await userEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() =>
      expect(screen.getAllByText(/이미 다른 폼이 쓰는 주소/)).not.toHaveLength(
        0,
      ),
    );
  });
});

const optionGroup: AdminOneTimeFormDetail['optionGroups'][number] = {
  optionGroupId: 31,
  title: '참여 방식을 골라 주세요',
  description: null,
  selectType: 'SINGLE',
  isRequired: true,
  sortOrder: 0,
  options: [
    {
      optionId: 311,
      name: '온라인 라이브',
      description: null,
      additionalPrice: 0,
      badge: null,
      isVisible: true,
      sortOrder: 0,
    },
    {
      optionId: 312,
      name: '오프라인 현장 참여',
      description: null,
      additionalPrice: 10000,
      badge: '추천',
      isVisible: true,
      sortOrder: 1,
    },
  ],
};

const detailWithOptions: AdminOneTimeFormDetail = {
  ...detail,
  optionGroups: [optionGroup],
};

describe('OneTimeFormEditor 결제 설정', () => {
  it('유료 0원은 안내만 띄우고 저장은 그대로 보낸다', async () => {
    updateMutateAsync.mockResolvedValue(undefined);
    renderEditor({ detail });

    const price = screen.getByRole('textbox', { name: '기본 금액' });
    await userEvent.clear(price);
    expect(screen.getByText(ZERO_PRICE_NOTICE)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '저장' }));
    expect(updateMutateAsync).toHaveBeenCalledWith({
      formId: 7,
      body: expect.objectContaining({ isPaid: true, basePrice: 0 }),
    });
  });
});

describe('OneTimeFormEditor 옵션', () => {
  it('옵션 이름을 고치면 미리보기가 바로 바뀌고 저장하면 A7 로 보낸다', async () => {
    saveOptionGroupsMutateAsync.mockResolvedValue({
      optionGroups: [optionGroup],
    });
    renderEditor({ detail: detailWithOptions });

    expect(
      screen.getByText('11.15(토) 14:00 · 29,000원부터'),
    ).toBeInTheDocument();
    const name = screen.getByRole('textbox', { name: '옵션 1 이름' });
    await userEvent.clear(name);
    await userEvent.type(name, '줌 라이브');
    const preview = screen.getByText('신청 화면 미리보기').parentElement;
    expect(preview).toHaveTextContent('줌 라이브');

    await userEvent.click(screen.getByRole('button', { name: '옵션 저장' }));
    expect(saveOptionGroupsMutateAsync).toHaveBeenCalledWith({
      formId: 7,
      body: {
        optionGroups: [
          expect.objectContaining({
            optionGroupId: 31,
            options: [
              expect.objectContaining({ optionId: 311, name: '줌 라이브' }),
              expect.objectContaining({
                optionId: 312,
                additionalPrice: 10000,
              }),
            ],
          }),
        ],
      },
    });
    expect(await screen.findByText('옵션을 저장했습니다.')).toBeInTheDocument();
  });

  it('신청이 있는 폼에서 저장된 옵션을 지우면 먼저 묻는다', async () => {
    renderEditor({ detail: detailWithOptions });
    expect(
      screen.getByText(/결제된 옵션은 삭제 대신 노출만 끈다/),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '옵션 2 삭제' }));
    expect(screen.getByText('옵션을 삭제할까요?')).toBeInTheDocument();
    // 묻는 동안은 아직 지우지 않는다
    expect(screen.getByDisplayValue('오프라인 현장 참여')).toBeInTheDocument();

    await userEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: '삭제' }),
    );
    await waitFor(() =>
      expect(
        screen.queryByDisplayValue('오프라인 현장 참여'),
      ).not.toBeInTheDocument(),
    );
  });

  it('필수 칸이 비면 저장하지 않는다', async () => {
    renderEditor({ detail: detailWithOptions });
    await userEvent.clear(screen.getByRole('textbox', { name: '옵션 1 이름' }));
    await userEvent.click(screen.getByRole('button', { name: '옵션 저장' }));

    expect(screen.getByText('옵션 이름을 입력해 주세요.')).toBeInTheDocument();
    expect(saveOptionGroupsMutateAsync).not.toHaveBeenCalled();
  });
});
