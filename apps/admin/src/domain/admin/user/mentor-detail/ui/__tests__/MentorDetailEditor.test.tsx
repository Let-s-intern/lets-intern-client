import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();
const patch = vi.fn();
const put = vi.fn();
const getV2 = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    patch: (...args: unknown[]) => patch(...args),
    put: (...args: unknown[]) => put(...args),
  },
}));

vi.mock('@/utils/axiosV2', () => ({
  default: { get: (...args: unknown[]) => getV2(...args) },
}));

// 실제 Lexical 대신 초기값을 보여 주고 버튼으로 onChange 를 흉내 낸다
vi.mock('@/common/lexical/EditorApp', () => ({
  emptyEditorState: 'EMPTY',
  default: ({
    initialEditorStateJsonString,
    onChange,
  }: {
    initialEditorStateJsonString: string;
    onChange: (json: string) => void;
  }) => (
    <div>
      <span data-testid="editor-initial">{initialEditorStateJsonString}</span>
      <button type="button" onClick={() => onChange('NEW_DESCRIPTION')}>
        본문 고치기
      </button>
    </div>
  ),
}));

import MentorDetailEditor from '../MentorDetailEditor';

const userDetail = {
  userInfo: {
    userId: 7,
    id: 'mentor',
    name: '멘토',
    email: 'mentor@letscareer.test',
    contactEmail: null,
    phoneNum: '010-0000-0000',
    university: null,
    inflowPath: null,
    grade: null,
    major: null,
    wishField: null,
    wishJob: null,
    wishIndustry: null,
    wishEmploymentType: null,
    wishCompany: null,
    sns: null,
    nickname: '닉',
    introduction: '원래 한줄소개',
    description: 'SAVED_DESCRIPTION',
    accountType: null,
    accountNum: null,
    marketingAgree: null,
    authProvider: null,
    role: null,
    careerType: null,
    memo: null,
    isPoolUp: null,
    profileImgUrl: null,
    corpImgUrl: null,
  },
  applicationInfo: [],
  userDocumentInfo: null,
  careerInfos: null,
  experienceInfos: null,
  mentorHashTagInfos: [{ id: 1, type: 'JOB', title: '마케팅' }],
};

const hashTagList = [
  { id: 1, type: 'JOB', title: '마케팅' },
  { id: 2, type: 'JOB', title: '개발' },
];

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
      <MentorDetailEditor mentorId={7} />
    </QueryClientProvider>,
  );

const lastPatchBody = () => patch.mock.calls.at(-1)?.[1];

describe('MentorDetailEditor 프로필 소개·키워드', () => {
  beforeEach(() => {
    getV2.mockResolvedValue({ data: { data: userDetail } });
    get.mockImplementation((url: string) =>
      url === '/admin/mentor-hash-tag'
        ? Promise.resolve({
            data: { data: { mentorHashTagList: hashTagList } },
          })
        : Promise.resolve({ data: { data: [] } }),
    );
    patch.mockResolvedValue({});
    put.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('저장된 본문으로 에디터를 띄운다', async () => {
    renderEditor();
    expect(await screen.findByTestId('editor-initial')).toHaveTextContent(
      'SAVED_DESCRIPTION',
    );
  });

  it('본문을 고치지 않으면 요청에 description 이 없다', async () => {
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: '저장' }));

    await waitFor(() => expect(patch).toHaveBeenCalled());
    expect(lastPatchBody()).not.toHaveProperty('description');
  });

  it('본문을 고치면 description 을 함께 보낸다', async () => {
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: '본문 고치기' }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => expect(patch).toHaveBeenCalled());
    expect(lastPatchBody()).toMatchObject({ description: 'NEW_DESCRIPTION' });
  });

  it('한줄소개를 고치면 introduction 을 보내고, 비우면 빈 문자열로 보낸다', async () => {
    renderEditor();
    const textarea =
      await screen.findByPlaceholderText('한줄 소개를 입력해주세요');

    fireEvent.change(textarea, { target: { value: '새 한줄소개' } });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    await waitFor(() => expect(patch).toHaveBeenCalledTimes(1));
    expect(lastPatchBody()).toMatchObject({ introduction: '새 한줄소개' });

    fireEvent.change(textarea, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    await waitFor(() => expect(patch).toHaveBeenCalledTimes(2));
    expect(lastPatchBody()).toMatchObject({ introduction: '' });
  });

  it('키워드를 바꾸지 않으면 키워드 요청을 보내지 않는다', async () => {
    renderEditor();
    await screen.findByRole('button', { name: '#개발' });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => expect(patch).toHaveBeenCalled());
    expect(put).not.toHaveBeenCalled();
  });

  it('키워드를 선택·해제하면 최종 목록으로 PUT 한다', async () => {
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: '#개발' }));
    fireEvent.click(screen.getByRole('button', { name: '#마케팅' }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => expect(put).toHaveBeenCalled());
    expect(put).toHaveBeenCalledWith('/admin/mentor-hash-tag/mentors/7', {
      mentorHashTagIdList: [2],
    });
  });
});
