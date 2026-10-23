import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();
const post = vi.fn();
const uploadFile = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    post: (...args: unknown[]) => post(...args),
  },
}));

vi.mock('@/api/file', () => ({
  uploadFile: (...args: unknown[]) => uploadFile(...args),
}));

import CompanyLogoPickerDialog from '../CompanyLogoPickerDialog';

const logos = [
  { id: 1, name: '렛츠커리어', imageUrl: 'https://cdn.test/lc.png' },
  { id: 2, name: '카카오', imageUrl: 'https://cdn.test/kakao.png' },
];

const renderPicker = () => {
  get.mockResolvedValue({ data: { data: { companyLogoList: logos } } });
  const onSelect = vi.fn();
  render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
          },
        })
      }
    >
      <CompanyLogoPickerDialog onClose={vi.fn()} onSelect={onSelect} />
    </QueryClientProvider>,
  );
  return onSelect;
};

describe('CompanyLogoPickerDialog', () => {
  it('고르기 전에는 선택할 수 없고, 고르면 이미지 주소를 돌려준다', async () => {
    const onSelect = renderPicker();
    await screen.findByText('카카오');
    expect(screen.getByRole('button', { name: '선택' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /카카오/ }));
    fireEvent.click(screen.getByRole('button', { name: '선택' }));
    expect(onSelect).toHaveBeenCalledWith(logos[1]);
  });

  it('회사명으로 거른다', async () => {
    renderPicker();
    await screen.findByText('카카오');
    fireEvent.change(screen.getByLabelText('회사명 검색'), {
      target: { value: '렛츠' },
    });
    expect(screen.getByText('렛츠커리어')).toBeInTheDocument();
    expect(screen.queryByText('카카오')).not.toBeInTheDocument();
  });
});

describe('CompanyLogoPickerDialog 로고 등록', () => {
  const NEW_LOGO = {
    id: 7,
    name: '토스',
    imageUrl: 'https://cdn.test/toss.png',
  };

  afterEach(() => vi.clearAllMocks());

  // 등록 창이 뜨면 MUI 가 아래 선택 창을 aria-hidden 으로 가린다. 개수는 hidden 까지 센다
  const registerDialog = () =>
    screen
      .getAllByRole('dialog')
      .find((dialog) => within(dialog).queryByLabelText('회사명'))!;

  const fillAndSave = async () => {
    const dialog = registerDialog();
    fireEvent.change(within(dialog).getByLabelText('회사명'), {
      target: { value: '토스' },
    });
    fireEvent.change(within(dialog).getByLabelText('로고 이미지 업로드'), {
      target: { files: [new File(['x'], 'toss.png', { type: 'image/png' })] },
    });
    const save = within(dialog).getByRole('button', { name: '저장' });
    await waitFor(() => expect(save).toBeEnabled());
    fireEvent.click(save);
  };

  it('등록하면 등록 창을 닫고 방금 만든 로고를 고른 상태로 돌아온다. 지정은 선택을 눌러야 한다', async () => {
    uploadFile.mockResolvedValue(NEW_LOGO.imageUrl);
    post.mockResolvedValue({ data: { data: { id: NEW_LOGO.id } } });
    const onSelect = renderPicker();
    await screen.findByText('카카오');
    // 검색어가 있어도 등록 뒤에는 새 로고가 보이도록 비운다
    fireEvent.change(screen.getByLabelText('회사명 검색'), {
      target: { value: '카카' },
    });
    fireEvent.click(screen.getByRole('button', { name: '로고 등록' }));
    get.mockResolvedValue({
      data: { data: { companyLogoList: [...logos, NEW_LOGO] } },
    });
    await fillAndSave();

    await waitFor(() =>
      expect(screen.getAllByRole('dialog', { hidden: true })).toHaveLength(1),
    );
    expect(post).toHaveBeenCalledWith('/admin/company-logo', {
      name: '토스',
      imageUrl: NEW_LOGO.imageUrl,
    });
    expect(screen.getByLabelText('회사명 검색')).toHaveValue('');
    const newCard = await screen.findByRole('button', { name: /토스/ });
    expect(newCard).toHaveAttribute('aria-pressed', 'true');
    expect(onSelect).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: '선택' }));
    expect(onSelect).toHaveBeenCalledWith(NEW_LOGO);
  });

  it('이름이 겹쳐 409 면 등록 창에 알리고 둘 다 그대로 둔다', async () => {
    uploadFile.mockResolvedValue(NEW_LOGO.imageUrl);
    post.mockRejectedValue({ status: 409, code: 'COMPANY_LOGO_NAME_CONFLICT' });
    renderPicker();
    await screen.findByText('카카오');
    fireEvent.click(screen.getByRole('button', { name: '로고 등록' }));
    await fillAndSave();

    expect(
      await within(registerDialog()).findByRole('alert'),
    ).toHaveTextContent('같은 회사명이 이미 있습니다.');
    expect(screen.getAllByRole('dialog', { hidden: true })).toHaveLength(2);
  });

  it('등록을 취소하면 선택 창으로 돌아온다', async () => {
    renderPicker();
    await screen.findByText('카카오');
    fireEvent.click(screen.getByRole('button', { name: '로고 등록' }));
    fireEvent.click(
      within(registerDialog()).getByRole('button', { name: '취소' }),
    );
    await waitFor(() =>
      expect(screen.getAllByRole('dialog', { hidden: true })).toHaveLength(1),
    );
    expect(screen.getByText('로고 선택')).toBeInTheDocument();
    expect(post).not.toHaveBeenCalled();
  });

  it('맞는 로고가 없으면 빈 상태 안에도 로고 등록을 둔다', async () => {
    renderPicker();
    await screen.findByText('카카오');
    fireEvent.change(screen.getByLabelText('회사명 검색'), {
      target: { value: '없는회사' },
    });
    expect(screen.getAllByRole('button', { name: '로고 등록' })).toHaveLength(
      2,
    );
  });
});
