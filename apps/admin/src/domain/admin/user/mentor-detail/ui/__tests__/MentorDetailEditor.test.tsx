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

// jsdom 의 Blob 에는 text() 가 없다
const readBlob = (blob: Blob) =>
  new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsText(blob);
  });

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

  it('한줄소개를 고치지 않으면 요청에 introduction 이 없다', async () => {
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: '저장' }));

    await waitFor(() => expect(patch).toHaveBeenCalled());
    expect(lastPatchBody()).not.toHaveProperty('introduction');
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

describe('MentorDetailEditor 경력 수정·대표 지정', () => {
  const careers = [
    {
      id: 11,
      company: '대표회사',
      job: '기획',
      employmentType: '정규직',
      startDate: '2022-01',
      endDate: null,
      field: null,
      position: null,
      department: null,
      isAddedByAdmin: false,
      isRepresentative: true,
    },
    {
      id: 12,
      company: '이전회사',
      job: '마케팅',
      employmentType: '계약직',
      startDate: '2019-03',
      endDate: '2021-12',
      field: null,
      position: '매니저',
      department: null,
      isAddedByAdmin: true,
      isRepresentative: false,
    },
  ];

  const isCareerUrl = (url: string) =>
    url.startsWith('/admin/user-career/user/7');

  beforeEach(() => {
    getV2.mockResolvedValue({ data: { data: userDetail } });
    get.mockImplementation((url: string) => {
      if (url === '/admin/mentor-hash-tag')
        return Promise.resolve({
          data: { data: { mentorHashTagList: hashTagList } },
        });
      if (isCareerUrl(url)) return Promise.resolve({ data: { data: careers } });
      return Promise.resolve({ data: { data: [] } });
    });
    patch.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const careerFetchCount = () =>
    get.mock.calls.filter(([url]) => isCareerUrl(url)).length;

  it('「대표로 지정」 은 대표가 아닌 경력에만 있다', async () => {
    renderEditor();
    expect(
      await screen.findAllByRole('button', { name: '대표로 지정' }),
    ).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: '수정' })).toHaveLength(2);
  });

  it('대표로 지정하면 바로 저장하고 경력 목록을 다시 불러온다', async () => {
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: '대표로 지정' }));

    await waitFor(() =>
      expect(patch).toHaveBeenCalledWith(
        '/admin/user-career/user/7/12/representative',
      ),
    );
    await waitFor(() => expect(careerFetchCount()).toBe(2));
  });

  it('수정 다이얼로그에 기존 값을 채우고, 저장하면 multipart 로 PATCH 한다', async () => {
    renderEditor();
    await screen.findByText('이전회사');
    fireEvent.click(screen.getAllByRole('button', { name: '수정' })[1]);

    expect(screen.getByLabelText(/^회사/)).toHaveValue('이전회사');
    expect(screen.getByLabelText(/^직책/)).toHaveValue('매니저');
    expect(screen.getByLabelText(/^종료/)).toHaveValue('2021-12');

    fireEvent.change(screen.getByLabelText(/^직무/), {
      target: { value: '그로스 마케팅' },
    });
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() => expect(patch).toHaveBeenCalled());
    const [url, formData] = patch.mock.calls[0];
    expect(url).toBe('/admin/user-career/user/7/12');
    const requestDto = JSON.parse(
      await readBlob((formData as FormData).get('requestDto') as Blob),
    );
    expect(requestDto).toEqual({
      company: '이전회사',
      job: '그로스 마케팅',
      field: '',
      position: '매니저',
      department: '',
      employmentType: '계약직',
      startDate: '2019-03',
      endDate: '2021-12',
      logoImgUrl: '',
    });
    // 대표 체크를 하지 않았으면 대표 지정은 부르지 않는다
    expect(patch).toHaveBeenCalledTimes(1);
  });

  it('수정 다이얼로그에서 대표로 설정하면 저장 뒤 대표 지정도 부른다', async () => {
    renderEditor();
    await screen.findByText('이전회사');
    fireEvent.click(screen.getAllByRole('button', { name: '수정' })[1]);
    fireEvent.click(screen.getByLabelText(/대표 경력으로 설정/));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() =>
      expect(patch).toHaveBeenCalledWith(
        '/admin/user-career/user/7/12/representative',
      ),
    );
  });
});

describe('MentorDetailEditor 대표 로고 라이브러리 선택 (LC-3499)', () => {
  beforeEach(() => {
    getV2.mockResolvedValue({ data: { data: userDetail } });
    get.mockImplementation((url: string) => {
      if (url === '/admin/company-logo')
        return Promise.resolve({
          data: {
            data: {
              companyLogoList: [
                {
                  id: 3,
                  name: '네이버',
                  imageUrl: 'https://cdn.test/naver.png',
                },
              ],
            },
          },
        });
      if (url === '/admin/mentor-hash-tag')
        return Promise.resolve({
          data: { data: { mentorHashTagList: hashTagList } },
        });
      return Promise.resolve({ data: { data: [] } });
    });
    patch.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('라이브러리에서 고른 로고를 corpImgUrl 로 저장한다', async () => {
    renderEditor();
    fireEvent.click(
      await screen.findByRole('button', { name: '라이브러리에서 선택' }),
    );
    fireEvent.click(await screen.findByRole('button', { name: /네이버/ }));
    fireEvent.click(screen.getByRole('button', { name: '선택' }));
    expect(screen.getByAltText('로고')).toHaveAttribute(
      'src',
      'https://cdn.test/naver.png',
    );

    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    await waitFor(() => expect(patch).toHaveBeenCalled());
    expect(lastPatchBody()).toMatchObject({
      corpImgUrl: 'https://cdn.test/naver.png',
    });
  });
});
