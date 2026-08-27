import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import BlogPopupEditPage from './BlogPopupEditPage';

const mutateAsync = vi.fn();
const navigate = vi.fn();

const blogPopupInfo = {
  blogPopupId: 5,
  title: '1대1 라이브 멘토링 홍보',
  imageUrl: 'https://cdn.test/popup.png',
  link: 'https://letscareer.co.kr/live-mentoring',
  targetType: 'SELECTED' as const,
  blogIds: [9],
  triggerRatio: 0.6,
  isVisible: true,
  startDate: '2026-09-01T09:00:00',
  endDate: '2026-09-30T11:59:00',
  impressionCount: 1200,
  clickCount: 37,
};

vi.mock('@/api/blog/blogPopup', () => ({
  useGetAdminBlogPopup: () => ({ data: { blogPopupInfo } }),
  usePatchAdminBlogPopup: () => ({ mutateAsync }),
}));

const blogInfos = [
  { id: 7, title: '면접 준비 체크리스트', category: 'JOB_PREPARATION_TIPS' },
  { id: 9, title: '자소서 첨삭 후기', category: 'PROGRAM_REVIEWS' },
].map((blogThumbnailInfo) => ({ blogThumbnailInfo, tagDetailInfos: [] }));

vi.mock('@/api/blog/blog', () => ({
  useBlogListQuery: () => ({ data: { blogInfos }, isLoading: false }),
}));

vi.mock('@/api/file', () => ({
  fileType: { enum: { BLOG_BANNER: 'BLOG_BANNER' } },
  uploadFile: vi.fn(async () => 'https://cdn.test/new.png'),
}));

vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
  useParams: () => ({ id: '5' }),
}));

const renderPage = () =>
  render(
    <MemoryRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <BlogPopupEditPage />
      </LocalizationProvider>
    </MemoryRouter>,
  );

const save = (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole('button', { name: '저장' }));

const body = () => mutateAsync.mock.calls[0][0];

beforeEach(() => {
  mutateAsync.mockReset();
  navigate.mockReset();
});

describe('BlogPopupEditPage', () => {
  it('상세 조회 값으로 폼을 채운다', () => {
    renderPage();

    expect(screen.getByRole('textbox', { name: '제목' })).toHaveValue(
      '1대1 라이브 멘토링 홍보',
    );
    expect(screen.getByRole('textbox', { name: '링크' })).toHaveValue(
      'https://letscareer.co.kr/live-mentoring',
    );
    expect(screen.getByLabelText('트리거 비율')).toHaveValue(0.6);
    expect(screen.getByLabelText('노출 여부')).toBeChecked();
    expect(screen.getByRole('radio', { name: '특정 글 선택' })).toBeChecked();
  });

  it('선택된 blogIds 가 칩으로 복원된다', () => {
    renderPage();

    expect(
      within(screen.getByTestId('selected-blog-chips')).getByText(
        '자소서 첨삭 후기',
      ),
    ).toBeInTheDocument();
  });

  it('업로드한 이미지가 미리보기에 뜬다', () => {
    renderPage();

    const preview = document.querySelectorAll('img');
    expect(
      Array.from(preview).some(
        (img) => img.getAttribute('src') === 'https://cdn.test/popup.png',
      ),
    ).toBe(true);
  });

  it('노출 대상을 건드리지 않으면 blogIds 를 바디에서 뺀다', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.clear(screen.getByRole('textbox', { name: '제목' }));
    await user.type(
      screen.getByRole('textbox', { name: '제목' }),
      '제목만 수정',
    );
    await save(user);

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    expect(body()).not.toHaveProperty('blogIds');
    expect(body()).toMatchObject({ blogPopupId: 5, title: '제목만 수정' });
  });

  it('글을 더 고르면 blogIds 전체를 보낸다', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole('checkbox', { name: '면접 준비 체크리스트' }),
    );
    await save(user);

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    expect(body()).toMatchObject({ blogIds: [7, 9] });
  });

  it('전체 노출로 바꾸면 빈 배열을 보내 기존 대상을 지운다', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('radio', { name: '전체 블로그' }));
    await save(user);

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledTimes(1));
    expect(body()).toMatchObject({ targetType: 'ALL', blogIds: [] });
  });

  it('저장에 성공하면 목록으로 이동한다', async () => {
    const user = userEvent.setup();
    renderPage();

    await save(user);

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/blog/popup'));
  });
});
