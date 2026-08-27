import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminSnackbarProvider } from '@/hooks/useAdminSnackbar';
import BlogPopupCreatePage from './BlogPopupCreatePage';

const mutateAsync = vi.fn();
const navigate = vi.fn();

/** 우선순위 드롭다운이 이미 쓰인 숫자를 가리려고 목록을 읽는다. */
const takenPopupList = [
  {
    blogPopupId: 1,
    title: '기존 팝업',
    targetType: 'ALL' as const,
    priority: 2,
  },
  {
    blogPopupId: 2,
    title: '우선순위 없는 팝업',
    targetType: 'ALL' as const,
    priority: null,
  },
];

vi.mock('@/api/blog/blogPopup', () => ({
  usePostAdminBlogPopup: () => ({ mutateAsync }),
  useGetAdminBlogPopupList: () => ({
    data: {
      blogPopupList: takenPopupList,
      pageInfo: { pageNum: 0, pageSize: 500, totalElements: 2, totalPages: 1 },
    },
  }),
}));

const blogInfos = [
  { id: 7, title: '면접 준비 체크리스트', category: 'JOB_PREPARATION_TIPS' },
  { id: 9, title: '자소서 첨삭 후기', category: 'PROGRAM_REVIEWS' },
].map((blogThumbnailInfo) => ({ blogThumbnailInfo, tagDetailInfos: [] }));

vi.mock('@/api/blog/blog', () => ({
  useBlogListQuery: () => ({ data: { blogInfos }, isLoading: false }),
}));

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
}));

const renderPage = () =>
  render(
    <MemoryRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <AdminSnackbarProvider>
          <BlogPopupCreatePage />
        </AdminSnackbarProvider>
      </LocalizationProvider>
    </MemoryRouter>,
  );

/**
 * DateTimePicker 는 구획 입력이라 한 번에 타이핑해 채운다. main.tsx 와 같은 ko 로케일이라
 * 형식은 YYYY.MM.DD hh:mm 오전/오후 이고, 오전·오후 구획은 글자로 못 넣어 방향키로 고른다.
 */
const fillDate = async (
  user: ReturnType<typeof userEvent.setup>,
  label: string,
  typed: string,
) => {
  const field = screen.getByRole('textbox', { name: label });
  await user.click(field);
  await user.keyboard(typed);
};

/** 이미지 업로드는 서버를 타므로 여기서는 파일 선택 대신 업로드 결과만 흉내 낸다. */
vi.mock('@/api/file', () => ({
  fileType: { enum: { BLOG_BANNER: 'BLOG_BANNER' } },
  uploadFile: vi.fn(async () => 'https://cdn.test/popup.png'),
}));

const uploadImage = async (user: ReturnType<typeof userEvent.setup>) => {
  const input = document.querySelector<HTMLInputElement>('input[type="file"]')!;
  await user.upload(
    input,
    new File(['popup'], 'popup.png', { type: 'image/png' }),
  );
};

const fillRequiredFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByRole('textbox', { name: /제목/ }), '팝업 제목');
  await user.type(
    screen.getByRole('textbox', { name: /링크/ }),
    'https://letscareer.co.kr/live-mentoring',
  );
  await uploadImage(user);
  await fillDate(user, '시작 일자', '202609010900{ArrowUp}');
  await fillDate(user, '종료 일자', '202609301159{ArrowUp}');
};

const save = (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole('button', { name: '저장' }));

beforeEach(() => {
  mutateAsync.mockReset();
  navigate.mockReset();
});

describe('BlogPopupCreatePage', () => {
  it('폼에 필요한 필드를 모두 그린다', () => {
    renderPage();

    expect(screen.getByRole('textbox', { name: /제목/ })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /링크/ })).toBeInTheDocument();
    expect(screen.getByText('팝업 이미지 업로드')).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: '전체 블로그' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('트리거 비율')).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: '노출 우선순위' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('노출 여부')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: '시작 일자' }),
    ).toBeInTheDocument();
  });

  it('필수값이 비어 있으면 저장하지 않는다', async () => {
    const user = userEvent.setup();
    renderPage();

    await save(user);

    expect(mutateAsync).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('전체 노출로 저장하면 blogIds 가 빈 배열로 나간다', async () => {
    const user = userEvent.setup();
    renderPage();

    await fillRequiredFields(user);
    await save(user);

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    expect(mutateAsync.mock.calls[0][0]).toMatchObject({
      title: '팝업 제목',
      imageUrl: 'https://cdn.test/popup.png',
      link: 'https://letscareer.co.kr/live-mentoring',
      targetType: 'ALL',
      blogIds: [],
      triggerRatio: 1,
      priority: null,
      isVisible: false,
      startDate: '2026-09-01T09:00:00',
      endDate: '2026-09-30T11:59:00',
    });
  });

  it('저장에 성공하면 목록으로 이동한다', async () => {
    const user = userEvent.setup();
    renderPage();

    await fillRequiredFields(user);
    await save(user);

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/blog/popup'));
  });

  it('특정 글 선택인데 글을 고르지 않으면 저장하지 않는다', async () => {
    const user = userEvent.setup();
    renderPage();

    await fillRequiredFields(user);
    await user.click(screen.getByRole('radio', { name: '특정 글 선택' }));
    await save(user);

    expect(mutateAsync).not.toHaveBeenCalled();
  });

  it('특정 글 선택이면 고른 blogIds 가 나간다', async () => {
    const user = userEvent.setup();
    renderPage();

    await fillRequiredFields(user);
    await user.click(screen.getByRole('radio', { name: '특정 글 선택' }));
    await user.click(
      screen.getByRole('checkbox', { name: '자소서 첨삭 후기' }),
    );
    await save(user);

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    expect(mutateAsync.mock.calls[0][0]).toMatchObject({
      targetType: 'SELECTED',
      blogIds: [9],
    });
  });

  it('글을 고른 뒤 전체 노출로 되돌리면 blogIds 를 보내지 않는다', async () => {
    const user = userEvent.setup();
    renderPage();

    await fillRequiredFields(user);
    await user.click(screen.getByRole('radio', { name: '특정 글 선택' }));
    await user.click(
      screen.getByRole('checkbox', { name: '자소서 첨삭 후기' }),
    );
    await user.click(screen.getByRole('radio', { name: '전체 블로그' }));
    await save(user);

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    expect(mutateAsync.mock.calls[0][0]).toMatchObject({
      targetType: 'ALL',
      blogIds: [],
    });
  });
});

const openPriority = async (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole('combobox', { name: '노출 우선순위' }));

describe('BlogPopupCreatePage 노출 우선순위', () => {
  it('기본값은 없음이다', () => {
    renderPage();

    expect(
      screen.getByRole('combobox', { name: '노출 우선순위' }),
    ).toHaveTextContent('없음');
  });

  it('안내 문구를 보여준다', () => {
    renderPage();

    expect(
      screen.getByText(
        '숫자가 작을수록 먼저 노출됩니다. 없음으로 두면 숫자가 지정된 팝업보다 뒤로 밀립니다.',
      ),
    ).toBeInTheDocument();
  });

  it('다른 팝업이 쓰는 숫자는 어느 팝업인지와 함께 비활성화한다', async () => {
    const user = userEvent.setup();
    renderPage();

    await openPriority(user);

    expect(
      screen.getByRole('option', { name: '2 (사용 중: 기존 팝업)' }),
    ).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('option', { name: '1' })).not.toHaveAttribute(
      'aria-disabled',
    );
  });

  it('없음은 여럿이 함께 쓸 수 있어 비활성화하지 않는다', async () => {
    const user = userEvent.setup();
    renderPage();

    await openPriority(user);

    expect(screen.getByRole('option', { name: '없음' })).not.toHaveAttribute(
      'aria-disabled',
    );
  });

  it('고른 우선순위가 그대로 나간다', async () => {
    const user = userEvent.setup();
    renderPage();

    await fillRequiredFields(user);
    await openPriority(user);
    await user.click(screen.getByRole('option', { name: '3' }));
    await save(user);

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    expect(mutateAsync.mock.calls[0][0]).toMatchObject({ priority: 3 });
  });

  it('서버가 거절하면 서버 문구를 보여주고 목록으로 가지 않는다', async () => {
    const user = userEvent.setup();
    mutateAsync.mockRejectedValueOnce(
      Object.assign(new Error('rejected'), {
        isAxiosError: true,
        response: {
          status: 409,
          data: { message: '이미 사용 중인 우선순위입니다.' },
        },
      }),
    );
    renderPage();

    await fillRequiredFields(user);
    await save(user);

    await waitFor(() =>
      expect(
        screen.getByText('이미 사용 중인 우선순위입니다.'),
      ).toBeInTheDocument(),
    );
    expect(navigate).not.toHaveBeenCalled();
  });
});
