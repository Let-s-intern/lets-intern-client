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

import { AdminSnackbarProvider } from '@/hooks/useAdminSnackbar';

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
    post.mockResolvedValue({ data: { data: { id: 99 } } });
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

  it('쓰는 곳이 있어 409 면 서버 문구(사용 건수)를 그대로 알린다', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    del.mockRejectedValue({
      status: 409,
      code: 'COMPANY_LOGO_IN_USE',
      message: '멘토 2명이 이 로고를 쓰고 있어 삭제할 수 없습니다.',
    });
    render(
      <QueryClientProvider client={new QueryClient()}>
        <AdminSnackbarProvider>
          <CompanyLogoManager />
        </AdminSnackbarProvider>
      </QueryClientProvider>,
    );
    await screen.findByText('카카오');
    fireEvent.click(screen.getAllByRole('button', { name: '삭제' })[1]);

    expect(
      await screen.findByText(
        '멘토 2명이 이 로고를 쓰고 있어 삭제할 수 없습니다.',
      ),
    ).toBeInTheDocument();
  });

  it('바꾸면 연결된 멘토 로고도 바뀐다고 안내한다', async () => {
    renderManager();
    expect(
      await screen.findByText(/연결된 멘토 로고도 함께 바뀝니다/),
    ).toBeInTheDocument();
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

  describe('CompanyLogoFormDialog 로고 후보', () => {
    const CANDIDATES = [
      {
        url: 'https://toss.test/apple-touch-icon.png',
        format: 'PNG',
        width: 180,
        height: 180,
        byteSize: 4000,
        source: 'APPLE_TOUCH_ICON',
      },
      {
        url: 'https://toss.test/favicon.ico',
        format: 'ICO',
        width: null,
        height: null,
        byteSize: 1000,
        source: 'FAVICON_ICO',
      },
    ];

    const mockFavicon = () =>
      post.mockImplementation((url: string) => {
        if (url === '/admin/company-logo/favicon/candidates')
          return Promise.resolve({
            data: { data: { candidates: CANDIDATES } },
          });
        if (url === '/admin/company-logo/favicon')
          return Promise.resolve({
            data: { data: { imageUrl: 'https://cdn.test/uploaded.png' } },
          });
        return Promise.resolve({ data: { data: { id: 99 } } });
      });

    const openRegisterDialog = async () => {
      get.mockResolvedValue({ data: { data: { companyLogoList: logos } } });
      renderManager();
      fireEvent.click(await screen.findByRole('button', { name: '로고 등록' }));
    };

    const findCandidates = async (siteUrl = 'https://toss.im') => {
      fireEvent.change(screen.getByLabelText('회사 사이트 주소'), {
        target: { value: siteUrl },
      });
      fireEvent.click(screen.getByRole('button', { name: '로고 후보 찾기' }));
    };

    afterEach(() => vi.clearAllMocks());

    it('주소가 비어 있으면 후보 찾기 버튼이 꺼져 있다', async () => {
      await openRegisterDialog();
      const button = screen.getByRole('button', { name: '로고 후보 찾기' });
      expect(button).toBeDisabled();
      fireEvent.change(screen.getByLabelText('회사 사이트 주소'), {
        target: { value: '   ' },
      });
      expect(button).toBeDisabled();
    });

    it('후보를 크기·출처 라벨과 함께 보이고 첫 번째를 기본으로 고른다', async () => {
      mockFavicon();
      await openRegisterDialog();
      await findCandidates(' https://toss.im ');

      const first = await screen.findByRole('radio', { name: 'PNG 180×180' });
      expect(first).toHaveAttribute('aria-checked', 'true');
      const second = screen.getByRole('radio', { name: 'ICO 크기 모름' });
      expect(second).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByText('apple-touch-icon')).toBeInTheDocument();
      expect(screen.getByText('/favicon.ico')).toBeInTheDocument();
      expect(first.querySelector('img')).toHaveAttribute(
        'referrerpolicy',
        'no-referrer',
      );
      expect(post).toHaveBeenCalledWith(
        '/admin/company-logo/favicon/candidates',
        { siteUrl: 'https://toss.im' },
        expect.anything(),
      );
    });

    it('썸네일이 깨지면 미리보기 불가로 바꾸고, 그래도 고를 수 있다', async () => {
      mockFavicon();
      await openRegisterDialog();
      await findCandidates();

      const second = await screen.findByRole('radio', {
        name: 'ICO 크기 모름',
      });
      fireEvent.error(second.querySelector('img')!);
      expect(second).toHaveTextContent('미리보기 불가');
      fireEvent.click(second);
      expect(second).toHaveAttribute('aria-checked', 'true');
    });

    it('고른 후보를 올려 미리보기·저장 값에 쓰고 후보를 닫는다. 회사명은 그대로다', async () => {
      mockFavicon();
      await openRegisterDialog();
      await findCandidates();

      fireEvent.click(
        await screen.findByRole('radio', { name: 'ICO 크기 모름' }),
      );
      fireEvent.click(screen.getByRole('button', { name: '이 로고 사용' }));

      await waitFor(() =>
        expect(screen.getByAltText('로고')).toHaveAttribute(
          'src',
          'https://cdn.test/uploaded.png',
        ),
      );
      expect(post).toHaveBeenCalledWith('/admin/company-logo/favicon', {
        siteUrl: 'https://toss.im',
        candidateUrl: 'https://toss.test/favicon.ico',
      });
      expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
      expect(screen.getByLabelText('회사명')).toHaveValue('');

      fireEvent.change(screen.getByLabelText('회사명'), {
        target: { value: '토스' },
      });
      fireEvent.click(screen.getByRole('button', { name: '저장' }));
      await waitFor(() =>
        expect(post).toHaveBeenCalledWith('/admin/company-logo', {
          name: '토스',
          imageUrl: 'https://cdn.test/uploaded.png',
        }),
      );
    });

    it('사이트 주소를 바꾸면 이전 후보를 지운다', async () => {
      mockFavicon();
      await openRegisterDialog();
      await findCandidates();
      await screen.findByRole('radiogroup', { name: '로고 후보' });

      fireEvent.change(screen.getByLabelText('회사 사이트 주소'), {
        target: { value: 'https://kakao.com' },
      });
      expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    });

    it.each([
      ['COMPANY_LOGO_FAVICON_INVALID_URL', '사이트 주소를 확인해 주세요.'],
      [
        'COMPANY_LOGO_FAVICON_FETCH_FAILED',
        '파비콘을 가져오지 못했습니다. 이미지를 직접 올려 주세요.',
      ],
      ['COMPANY_LOGO_FAVICON_TOO_LARGE', '파비콘 파일이 너무 큽니다.'],
      ['SOMETHING_ELSE', '파비콘을 가져오지 못했습니다.'],
    ])('후보 찾기가 %s 이면 「%s」 를 알린다', async (code, message) => {
      post.mockRejectedValue({ status: 400, code });
      await openRegisterDialog();
      await findCandidates();

      expect(await screen.findByRole('alert')).toHaveTextContent(message);
    });

    it('올리기가 실패해도 같은 문구로 알리고 후보는 남긴다', async () => {
      post.mockImplementation((url: string) =>
        url === '/admin/company-logo/favicon/candidates'
          ? Promise.resolve({ data: { data: { candidates: CANDIDATES } } })
          : Promise.reject({
              status: 400,
              code: 'COMPANY_LOGO_FAVICON_TOO_LARGE',
            }),
      );
      await openRegisterDialog();
      await findCandidates();
      fireEvent.click(
        await screen.findByRole('button', { name: '이 로고 사용' }),
      );

      expect(await screen.findByRole('alert')).toHaveTextContent(
        '파비콘 파일이 너무 큽니다.',
      );
      expect(
        screen.getByRole('radiogroup', { name: '로고 후보' }),
      ).toBeInTheDocument();
    });
  });

  describe('CompanyLogoFormDialog 사이트 이름으로 회사명 채우기', () => {
    const CANDIDATE = {
      url: 'https://site.test/apple-touch-icon.png',
      format: 'PNG',
      width: 180,
      height: 180,
      byteSize: 4000,
      source: 'APPLE_TOUCH_ICON',
    };
    const HINT = '사이트에서 가져온 이름입니다. 고쳐도 됩니다.';

    // 사이트 주소마다 다른 siteName 을 돌려준다
    const mockSiteNames = (names: Record<string, string | null>) =>
      post.mockImplementation((url: string, body: { siteUrl: string }) =>
        url === '/admin/company-logo/favicon/candidates'
          ? Promise.resolve({
              data: {
                data: {
                  candidates: [CANDIDATE],
                  siteName: names[body.siteUrl],
                },
              },
            })
          : Promise.resolve({}),
      );

    const find = async (siteUrl: string) => {
      fireEvent.change(screen.getByLabelText('회사 사이트 주소'), {
        target: { value: siteUrl },
      });
      fireEvent.click(screen.getByRole('button', { name: '로고 후보 찾기' }));
      await screen.findByRole('radiogroup', { name: '로고 후보' });
    };

    const nameInput = () => screen.getByLabelText('회사명');

    const openRegister = async () => {
      renderManager();
      fireEvent.click(await screen.findByRole('button', { name: '로고 등록' }));
    };

    afterEach(() => vi.clearAllMocks());

    it('회사명이 비어 있으면 사이트 이름으로 채우고 안내를 보인다', async () => {
      mockSiteNames({ 'https://toss.im': '토스' });
      await openRegister();
      await find('https://toss.im');

      expect(nameInput()).toHaveValue('토스');
      expect(screen.getByText(HINT)).toBeInTheDocument();
    });

    it('사용자가 쓴 회사명은 덮어쓰지 않는다', async () => {
      mockSiteNames({ 'https://toss.im': '토스' });
      await openRegister();
      fireEvent.change(nameInput(), { target: { value: '비바리퍼블리카' } });
      await find('https://toss.im');

      expect(nameInput()).toHaveValue('비바리퍼블리카');
      expect(screen.queryByText(HINT)).not.toBeInTheDocument();
    });

    it('사이트 이름으로 채운 그대로면 다른 사이트로 다시 찾을 때 바꾼다', async () => {
      mockSiteNames({
        'https://toss.im': '토스',
        'https://kakao.com': '카카오',
      });
      await openRegister();
      await find('https://toss.im');
      await find('https://kakao.com');

      expect(nameInput()).toHaveValue('카카오');
    });

    it('사이트 이름으로 채운 뒤 고치면 안내를 숨기고, 다시 찾아도 그대로 둔다', async () => {
      mockSiteNames({
        'https://toss.im': '토스',
        'https://kakao.com': '카카오',
      });
      await openRegister();
      await find('https://toss.im');
      fireEvent.change(nameInput(), { target: { value: '토스뱅크' } });
      expect(screen.queryByText(HINT)).not.toBeInTheDocument();

      await find('https://kakao.com');
      expect(nameInput()).toHaveValue('토스뱅크');
    });

    it('사이트 이름이 null 이면 아무것도 하지 않는다', async () => {
      mockSiteNames({ 'https://toss.im': null });
      await openRegister();
      await find('https://toss.im');

      expect(nameInput()).toHaveValue('');
      expect(screen.queryByText(HINT)).not.toBeInTheDocument();
    });

    it('기존 로고 수정에서는 채우지 않는다', async () => {
      mockSiteNames({ 'https://kakao.com': '카카오 공식' });
      renderManager();
      await screen.findByText('카카오');
      fireEvent.click(screen.getAllByRole('button', { name: '수정' })[1]);
      await find('https://kakao.com');

      expect(nameInput()).toHaveValue('카카오');
      expect(screen.queryByText(HINT)).not.toBeInTheDocument();
    });
  });
});
