import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();
const patch = vi.fn();
const put = vi.fn();
const post = vi.fn();
const getV2 = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    patch: (...args: unknown[]) => patch(...args),
    put: (...args: unknown[]) => put(...args),
    post: (...args: unknown[]) => post(...args),
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

import { AdminSnackbarProvider } from '@/hooks/useAdminSnackbar';

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
      {/* 스낵바 문구를 확인할 수 있게 실제 Provider 로 감싼다 */}
      <AdminSnackbarProvider>
        <MentorDetailEditor mentorId={7} />
      </AdminSnackbarProvider>
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

  it('「대표로 지정」 은 대표가 아닌 경력에만 있고, 오른쪽 수정·삭제 묶음에는 없다', async () => {
    renderEditor();
    expect(
      await screen.findAllByRole('button', { name: '대표로 지정' }),
    ).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: '수정' })).toHaveLength(2);
    for (const editButton of screen.getAllByRole('button', { name: '수정' })) {
      expect(
        within(editButton.parentElement!)
          .getAllByRole('button')
          .map((button) => button.textContent),
      ).toEqual(['수정', '삭제']);
    }
  });

  it('대표로 지정은 확인 창에서 취소하면 요청하지 않는다', async () => {
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: '대표로 지정' }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent(
      '이 경력을 대표 경력으로 바꿀까요? 웹 멘토 카드의 회사·직무가 바뀝니다.',
    );
    fireEvent.click(within(dialog).getByRole('button', { name: '취소' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(patch).not.toHaveBeenCalled();
  });

  it('대표로 지정을 확인하면 저장하고 경력 목록을 다시 불러온다', async () => {
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: '대표로 지정' }));
    fireEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: '대표로 지정',
      }),
    );

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
    });
    // 로고는 경력 본문으로 보내지 않는다(라이브러리 연결로 따로 저장)
    expect(requestDto).not.toHaveProperty('logoImgUrl');
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

const NAVER_LOGO = {
  id: 3,
  name: '네이버',
  imageUrl: 'https://cdn.test/naver.png',
};

const mockLogoApis = (careerList: unknown[] = []) =>
  get.mockImplementation((url: string) => {
    if (url === '/admin/company-logo')
      return Promise.resolve({
        data: { data: { companyLogoList: [NAVER_LOGO] } },
      });
    if (url === '/admin/mentor-hash-tag')
      return Promise.resolve({
        data: { data: { mentorHashTagList: hashTagList } },
      });
    if (url.startsWith('/admin/user-career/user/7'))
      return Promise.resolve({ data: { data: careerList } });
    return Promise.resolve({ data: { data: [] } });
  });

const pickNaverLogo = async (
  scope: Pick<typeof screen, 'findByRole'> = screen,
) => {
  fireEvent.click(
    await scope.findByRole('button', { name: '라이브러리에서 선택' }),
  );
  fireEvent.click(await screen.findByRole('button', { name: /네이버/ }));
  fireEvent.click(screen.getByRole('button', { name: '선택' }));
};

describe('MentorDetailEditor 대표 로고 라이브러리 연결', () => {
  beforeEach(() => {
    getV2.mockResolvedValue({ data: { data: userDetail } });
    mockLogoApis();
    patch.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('라이브러리에서 고르면 저장 때 corp-logo 로 연결하고, 프로필 PATCH 에 corpImgUrl 은 없다', async () => {
    renderEditor();
    // 대표 로고는 이미지를 누르면 라이브러리 선택 창이 바로 열린다
    fireEvent.click(
      await screen.findByRole('button', { name: '대표 회사 로고 변경' }),
    );
    fireEvent.click(await screen.findByRole('button', { name: /네이버/ }));
    fireEvent.click(screen.getByRole('button', { name: '선택' }));
    expect(screen.getByAltText('로고')).toHaveAttribute(
      'src',
      'https://cdn.test/naver.png',
    );
    expect(screen.getByText('라이브러리: 네이버')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    await waitFor(() =>
      expect(patch).toHaveBeenCalledWith('/admin/user/7/corp-logo', {
        companyLogoId: 3,
      }),
    );
    const profileBody = patch.mock.calls.find(
      ([url]) => url === '/user/7',
    )?.[1];
    expect(profileBody).not.toHaveProperty('corpImgUrl');
  });

  it('대표 로고 칸은 「로고 변경」 버튼이고, 아래에는 「개별 로고 설정」 만 있다', async () => {
    renderEditor();
    const logoButton = await screen.findByRole('button', {
      name: '대표 회사 로고 변경',
    });
    expect(logoButton).toHaveTextContent('로고 변경');
    expect(screen.getByText('개별 로고 설정')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '라이브러리에서 선택' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('직접 업로드')).not.toBeInTheDocument();
  });

  it('연결을 바꾸지 않으면 corp-logo 요청을 보내지 않는다', async () => {
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: '저장' }));
    await waitFor(() => expect(patch).toHaveBeenCalled());
    expect(patch.mock.calls.map(([url]) => url)).not.toContain(
      '/admin/user/7/corp-logo',
    );
  });

  it('연결 해제하면 저장 때 null 로 보낸다', async () => {
    getV2.mockResolvedValue({
      data: {
        data: {
          ...userDetail,
          userInfo: {
            ...userDetail.userInfo,
            corpImgUrl: NAVER_LOGO.imageUrl,
            corpLogoId: 3,
          },
        },
      },
    });
    renderEditor();
    expect(await screen.findByText('라이브러리: 네이버')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '연결 해제' }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() =>
      expect(patch).toHaveBeenCalledWith('/admin/user/7/corp-logo', {
        companyLogoId: null,
      }),
    );
  });

  it('직접 올리면 corpImgUrl 로 보내고 corp-logo 요청은 따로 보내지 않는다', async () => {
    post.mockResolvedValue({
      data: { data: { fileUrl: 'https://cdn.test/uploaded.png' } },
    });
    getV2.mockResolvedValue({
      data: {
        data: {
          ...userDetail,
          userInfo: { ...userDetail.userInfo, corpLogoId: 3 },
        },
      },
    });
    renderEditor();
    await screen.findByText('라이브러리: 네이버');
    // 「개별 로고 설정」 = 직접 업로드
    const fileInput = screen.getByLabelText('개별 로고 이미지 업로드');
    fireEvent.change(fileInput, {
      target: { files: [new File(['x'], 'logo.png', { type: 'image/png' })] },
    });
    await waitFor(() =>
      expect(screen.getByAltText('로고')).toHaveAttribute(
        'src',
        'https://cdn.test/uploaded.png',
      ),
    );
    expect(screen.queryByText('라이브러리: 네이버')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '저장' }));
    await waitFor(() => expect(patch).toHaveBeenCalled());
    expect(
      patch.mock.calls.find(([url]) => url === '/user/7')?.[1],
    ).toMatchObject({ corpImgUrl: 'https://cdn.test/uploaded.png' });
    expect(patch.mock.calls.map(([url]) => url)).not.toContain(
      '/admin/user/7/corp-logo',
    );
  });
});

describe('MentorDetailEditor 경력 로고 연결', () => {
  const career = {
    id: 12,
    company: '이전회사',
    job: '마케팅',
    employmentType: '계약직',
    startDate: '2019-03',
    endDate: '2021-12',
    field: null,
    position: null,
    department: null,
    isAddedByAdmin: true,
    isRepresentative: false,
  };

  beforeEach(() => {
    getV2.mockResolvedValue({ data: { data: userDetail } });
    patch.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('경력 수정에서 로고를 고르면 경력 PATCH 뒤 company-logo 로 연결한다', async () => {
    mockLogoApis([{ ...career, companyLogoId: null, logoImgUrl: null }]);
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: '수정' }));
    const dialog = screen.getByRole('dialog');
    await pickNaverLogo(within(dialog));
    fireEvent.click(within(dialog).getByRole('button', { name: '저장' }));

    await waitFor(() =>
      expect(patch).toHaveBeenCalledWith(
        '/admin/user-career/user/7/12/company-logo',
        { companyLogoId: 3 },
      ),
    );
    const urls = patch.mock.calls.map(([url]) => url);
    expect(urls.indexOf('/admin/user-career/user/7/12')).toBeLessThan(
      urls.indexOf('/admin/user-career/user/7/12/company-logo'),
    );
  });

  it('연결된 경력 로고를 해제하면 null 로 보내고, 행에 연결 회사명을 보인다', async () => {
    mockLogoApis([
      { ...career, companyLogoId: 3, logoImgUrl: NAVER_LOGO.imageUrl },
    ]);
    renderEditor();
    expect(await screen.findByText('라이브러리: 네이버')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '수정' }));
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: '로고 해제' }));
    fireEvent.click(within(dialog).getByRole('button', { name: '저장' }));

    await waitFor(() =>
      expect(patch).toHaveBeenCalledWith(
        '/admin/user-career/user/7/12/company-logo',
        { companyLogoId: null },
      ),
    );
  });

  it('로고를 바꾸지 않으면 company-logo 요청을 보내지 않는다', async () => {
    mockLogoApis([{ ...career, companyLogoId: 3, logoImgUrl: null }]);
    renderEditor();
    fireEvent.click(await screen.findByRole('button', { name: '수정' }));
    fireEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: '저장' }),
    );
    await waitFor(() =>
      expect(patch.mock.calls.map(([url]) => url)).toContain(
        '/admin/user-career/user/7/12',
      ),
    );
    expect(patch.mock.calls.map(([url]) => url)).not.toContain(
      '/admin/user-career/user/7/12/company-logo',
    );
  });
});

describe('MentorDetailEditor 경력 로고 칸에서 바로 변경', () => {
  const career = {
    id: 12,
    company: '이전회사',
    job: '마케팅',
    employmentType: '계약직',
    startDate: '2019-03',
    endDate: '2021-12',
    field: null,
    position: null,
    department: null,
    isAddedByAdmin: true,
    isRepresentative: false,
  };

  beforeEach(() => {
    getV2.mockResolvedValue({ data: { data: userDetail } });
    patch.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('로고 칸을 누르면 수정 창 없이 고른 로고를 바로 연결한다', async () => {
    mockLogoApis([{ ...career, companyLogoId: null, logoImgUrl: null }]);
    renderEditor();
    const cell = await screen.findByRole('button', {
      name: '이전회사 경력 로고 변경',
    });
    expect(cell).toHaveTextContent('없음');
    fireEvent.click(cell);
    expect(screen.queryByText('경력 수정')).not.toBeInTheDocument();
    // 로고가 없으면 해제할 것도 없다
    expect(
      screen.queryByRole('button', { name: '로고 해제' }),
    ).not.toBeInTheDocument();
    fireEvent.click(await screen.findByRole('button', { name: /네이버/ }));
    fireEvent.click(screen.getByRole('button', { name: '선택' }));

    await waitFor(() =>
      expect(patch).toHaveBeenCalledWith(
        '/admin/user-career/user/7/12/company-logo',
        { companyLogoId: 3 },
      ),
    );
    expect(patch).toHaveBeenCalledTimes(1);
  });

  it('선택 창의 로고 해제는 null 로 보낸다', async () => {
    mockLogoApis([
      { ...career, companyLogoId: 3, logoImgUrl: NAVER_LOGO.imageUrl },
    ]);
    renderEditor();
    fireEvent.click(
      await screen.findByRole('button', { name: '이전회사 경력 로고 변경' }),
    );
    fireEvent.click(await screen.findByRole('button', { name: '로고 해제' }));

    await waitFor(() =>
      expect(patch).toHaveBeenCalledWith(
        '/admin/user-career/user/7/12/company-logo',
        { companyLogoId: null },
      ),
    );
  });

  it('바꾸지 못하면 스낵바로 알린다', async () => {
    patch.mockRejectedValue(new Error('500'));
    mockLogoApis([{ ...career, companyLogoId: null, logoImgUrl: null }]);
    renderEditor();
    fireEvent.click(
      await screen.findByRole('button', { name: '이전회사 경력 로고 변경' }),
    );
    fireEvent.click(await screen.findByRole('button', { name: /네이버/ }));
    fireEvent.click(screen.getByRole('button', { name: '선택' }));

    expect(
      await screen.findByText('경력 로고를 바꾸지 못했습니다.'),
    ).toBeInTheDocument();
  });
});
