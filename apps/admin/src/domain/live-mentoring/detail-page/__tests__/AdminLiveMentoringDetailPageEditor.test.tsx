import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();
const put = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    put: (...args: unknown[]) => put(...args),
  },
}));

vi.mock('@/common/lexical/EditorApp', () => ({
  emptyEditorState: 'EMPTY',
  default: ({ onChange }: { onChange: (json: string) => void }) => (
    <button type="button" onClick={() => onChange('FREE_CONTENT')}>
      본문 입력
    </button>
  ),
}));

import AdminLiveMentoringDetailPageEditor from '../AdminLiveMentoringDetailPageEditor';

const detailPage = {
  mentoring: { liveMentoringId: 1, title: '1:1 멘토링' },
  intro: { nickname: '렛츠' },
  hero: { bullets: ['첫 불릿'] },
  mentoringTypes: {
    title: '유형',
    subtitle: '부제',
    items: [
      { typeName: '이력서', title: '카드', description: '설명', tags: [] },
    ],
  },
  strategy: { visible: false, title: '', subtitle: '', points: [] },
  video: {
    visible: false,
    title: '',
    subtitle: '',
    videoUrl: null,
    caption: '',
  },
  results: { visible: false, title: '', subtitle: '', cases: [] },
  reviews: { visible: true, selectedReviewIds: [] },
};

const renderEditor = () =>
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
      <AdminLiveMentoringDetailPageEditor mentorId={7} />
    </QueryClientProvider>,
  );

const editFirstBullet = async (value: string) => {
  fireEvent.change(await screen.findByLabelText('소개 문구 1'), {
    target: { value },
  });
};

describe('AdminLiveMentoringDetailPageEditor', () => {
  beforeEach(() => {
    get.mockResolvedValue({ data: { data: detailPage } });
  });

  afterEach(() => vi.clearAllMocks());

  it('멘토 닉네임으로 제목을 단다', async () => {
    renderEditor();
    expect(
      await screen.findByText('렛츠 멘토 상세페이지 수정'),
    ).toBeInTheDocument();
  });

  it('바꾸기 전에는 저장할 수 없다', async () => {
    renderEditor();
    expect(await screen.findByRole('button', { name: '저장' })).toBeDisabled();
  });

  it('저장하면 변환한 본문을 PUT 한다', async () => {
    put.mockResolvedValue({ data: { data: detailPage } });
    renderEditor();
    await editFirstBullet('  바뀐 불릿  ');
    fireEvent.click(screen.getByRole('button', { name: '소개 문구 추가 +' }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => expect(put).toHaveBeenCalled());
    const [url, body] = put.mock.calls[0];
    expect(url).toBe('/admin/live-mentoring/mentors/7/detail-page');
    // 빈 줄은 빠지고 공백은 다듬는다. 읽기 전용 값은 보내지 않는다
    expect(body.hero).toEqual({ bullets: ['바뀐 불릿'] });
    expect(body).not.toHaveProperty('intro');
    expect(body).not.toHaveProperty('mentoring');
  });

  it('409 면 다른 곳에서 먼저 수정되었다고 알린다', async () => {
    put.mockRejectedValue({ status: 409, message: 'conflict' });
    renderEditor();
    await editFirstBullet('바뀐 불릿');
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '다른 곳에서 먼저 수정되었습니다. 새로고침 후 다시 저장하세요',
    );
  });

  it('서버가 거절할 값이면 보내지 않고 이유를 알린다', async () => {
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: '멘토링 유형' }));
    fireEvent.change(screen.getByLabelText('섹션 제목'), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('멘토링 유형');
    expect(put).not.toHaveBeenCalled();
  });

  it('자유 입력란을 고치지 않아도 기본값으로 함께 PUT 한다', async () => {
    put.mockResolvedValue({ data: { data: detailPage } });
    renderEditor();
    await editFirstBullet('바뀐 불릿');
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => expect(put).toHaveBeenCalled());
    expect(put.mock.calls[0][1].freeContent).toEqual({
      visible: false,
      content: null,
      position: 'AFTER_MENTORING_TYPES',
    });
  });

  it('자유 입력란 탭에서 고친 노출·본문을 PUT 한다', async () => {
    put.mockResolvedValue({ data: { data: detailPage } });
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: '자유 입력란' }));
    fireEvent.click(screen.getByLabelText('상세페이지에 표시'));
    fireEvent.click(screen.getByRole('button', { name: '본문 입력' }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => expect(put).toHaveBeenCalled());
    expect(put.mock.calls[0][1].freeContent).toEqual({
      visible: true,
      content: 'FREE_CONTENT',
      position: 'AFTER_MENTORING_TYPES',
    });
  });

  it('취소하면 불러온 값으로 되돌린다', async () => {
    renderEditor();
    await editFirstBullet('바뀐 불릿');
    fireEvent.click(screen.getByRole('button', { name: '취소' }));
    expect(screen.getByLabelText('소개 문구 1')).toHaveValue('첫 불릿');
  });
});
