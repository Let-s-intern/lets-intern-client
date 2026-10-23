import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();
const post = vi.fn();
const patch = vi.fn();
const del = vi.fn();
const uploadFile = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    post: (...args: unknown[]) => post(...args),
    patch: (...args: unknown[]) => patch(...args),
    delete: (...args: unknown[]) => del(...args),
  },
}));

vi.mock('@/api/file', () => ({
  uploadFile: (...args: unknown[]) => uploadFile(...args),
}));

import CompanyLogoManager from '../../CompanyLogoManager';

const logos = [
  { id: 1, name: '렛츠커리어', imageUrl: 'https://cdn.test/lc.png' },
  { id: 2, name: '카카오', imageUrl: 'https://cdn.test/kakao.png' },
];

const renderManager = () =>
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
      <CompanyLogoManager />
    </QueryClientProvider>,
  );

describe('CompanyLogoManager', () => {
  beforeEach(() => {
    get.mockResolvedValue({ data: { data: { companyLogoList: logos } } });
    post.mockResolvedValue({});
    patch.mockResolvedValue({});
    del.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('회사명으로 거른다', async () => {
    renderManager();
    await screen.findByText('카카오');
    fireEvent.change(screen.getByLabelText('회사명 검색'), {
      target: { value: '카카' },
    });
    expect(screen.getByText('카카오')).toBeInTheDocument();
    expect(screen.queryByText('렛츠커리어')).not.toBeInTheDocument();
  });

  it('회사명과 올린 이미지로 등록한다', async () => {
    uploadFile.mockResolvedValue('https://cdn.test/new.png');
    renderManager();
    fireEvent.click(await screen.findByRole('button', { name: '로고 등록' }));

    fireEvent.change(screen.getByLabelText('회사명'), {
      target: { value: ' 네이버 ' },
    });
    const file = new File(['x'], 'naver.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('로고 이미지 업로드'), {
      target: { files: [file] },
    });
    await waitFor(() =>
      expect(uploadFile).toHaveBeenCalledWith({ file, type: 'COMPANY_LOGO' }),
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: '저장' })).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() =>
      expect(post).toHaveBeenCalledWith('/admin/company-logo', {
        name: '네이버',
        imageUrl: 'https://cdn.test/new.png',
      }),
    );
  });

  it('이름이 겹쳐 409 면 다이얼로그에 알린다', async () => {
    post.mockRejectedValue({ status: 409, message: 'conflict' });
    uploadFile.mockResolvedValue('https://cdn.test/new.png');
    renderManager();
    fireEvent.click(await screen.findByRole('button', { name: '로고 등록' }));
    fireEvent.change(screen.getByLabelText('회사명'), {
      target: { value: '카카오' },
    });
    fireEvent.change(screen.getByLabelText('로고 이미지 업로드'), {
      target: { files: [new File(['x'], 'a.png', { type: 'image/png' })] },
    });
    await waitFor(() =>
      expect(screen.getByRole('button', { name: '저장' })).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '같은 회사명이 이미 있습니다.',
    );
  });

  it('수정은 기존 값을 채워 PATCH 한다', async () => {
    renderManager();
    await screen.findByText('카카오');
    fireEvent.click(screen.getAllByRole('button', { name: '수정' })[1]);
    expect(screen.getByLabelText('회사명')).toHaveValue('카카오');
    fireEvent.change(screen.getByLabelText('회사명'), {
      target: { value: '카카오뱅크' },
    });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() =>
      expect(patch).toHaveBeenCalledWith('/admin/company-logo/2', {
        name: '카카오뱅크',
        imageUrl: 'https://cdn.test/kakao.png',
      }),
    );
  });

  it('삭제는 확인을 받은 뒤에만 부른다', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderManager();
    await screen.findByText('카카오');

    fireEvent.click(screen.getAllByRole('button', { name: '삭제' })[1]);
    expect(confirm).toHaveBeenCalled();
    expect(del).not.toHaveBeenCalled();

    confirm.mockReturnValue(true);
    fireEvent.click(screen.getAllByRole('button', { name: '삭제' })[1]);
    await waitFor(() =>
      expect(del).toHaveBeenCalledWith('/admin/company-logo/2'),
    );
  });

  describe('CompanyLogoFormDialog 파비콘 가져오기', () => {
    const openRegisterDialog = async () => {
      get.mockResolvedValue({ data: { data: { companyLogoList: logos } } });
      renderManager();
      fireEvent.click(await screen.findByRole('button', { name: '로고 등록' }));
      return screen.getByRole('dialog');
    };

    const fetchFavicon = (siteUrl: string) => {
      fireEvent.change(screen.getByLabelText('회사 사이트 주소'), {
        target: { value: siteUrl },
      });
      fireEvent.click(screen.getByRole('button', { name: '파비콘 가져오기' }));
    };

    afterEach(() => vi.clearAllMocks());

    it('주소가 비어 있으면 가져오기 버튼이 꺼져 있다', async () => {
      await openRegisterDialog();
      expect(
        screen.getByRole('button', { name: '파비콘 가져오기' }),
      ).toBeDisabled();
      fireEvent.change(screen.getByLabelText('회사 사이트 주소'), {
        target: { value: '   ' },
      });
      expect(
        screen.getByRole('button', { name: '파비콘 가져오기' }),
      ).toBeDisabled();
    });

    it('가져온 파비콘을 미리보기와 저장 값에 쓰고, 회사명은 건드리지 않는다', async () => {
      post.mockImplementation((url: string) =>
        url === '/admin/company-logo/favicon'
          ? Promise.resolve({
              data: { data: { imageUrl: 'https://cdn.test/favicon.png' } },
            })
          : Promise.resolve({}),
      );
      await openRegisterDialog();
      fetchFavicon(' https://toss.im ');

      await waitFor(() =>
        expect(screen.getByAltText('로고')).toHaveAttribute(
          'src',
          'https://cdn.test/favicon.png',
        ),
      );
      expect(post).toHaveBeenCalledWith('/admin/company-logo/favicon', {
        siteUrl: 'https://toss.im',
      });
      expect(screen.getByLabelText('회사명')).toHaveValue('');

      fireEvent.change(screen.getByLabelText('회사명'), {
        target: { value: '토스' },
      });
      fireEvent.click(screen.getByRole('button', { name: '저장' }));
      await waitFor(() =>
        expect(post).toHaveBeenCalledWith('/admin/company-logo', {
          name: '토스',
          imageUrl: 'https://cdn.test/favicon.png',
        }),
      );
    });

    it.each([
      ['COMPANY_LOGO_FAVICON_INVALID_URL', '사이트 주소를 확인해 주세요.'],
      [
        'COMPANY_LOGO_FAVICON_FETCH_FAILED',
        '파비콘을 가져오지 못했습니다. 이미지를 직접 올려 주세요.',
      ],
      ['COMPANY_LOGO_FAVICON_TOO_LARGE', '파비콘 파일이 너무 큽니다.'],
      ['SOMETHING_ELSE', '파비콘을 가져오지 못했습니다.'],
    ])('%s 이면 「%s」 를 알린다', async (code, message) => {
      post.mockRejectedValue({ status: 400, code });
      await openRegisterDialog();
      fetchFavicon('https://toss.im');

      expect(await screen.findByRole('alert')).toHaveTextContent(message);
    });
  });
});
