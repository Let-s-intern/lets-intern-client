jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { post: jest.fn(), get: jest.fn() },
}));

// 자동 채우기가 `@/api/user/user` 를 물고 오므로 그 모듈의 v2 네트워크 계층(`import.meta`)을 막는다
jest.mock('@/utils/axiosV2', () => ({ __esModule: true, default: {} }));

import useAuthStore from '@/store/useAuthStore';
import axios from '@/utils/axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MentorApplyForm from './MentorApplyForm';

const post = axios.post as jest.Mock;
const get = axios.get as jest.Mock;

const renderForm = (onSubmitted = jest.fn()) => {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <MentorApplyForm onSubmitted={onSubmitted} />
    </QueryClientProvider>,
  );
  return onSubmitted;
};

const requiredField = (label: string) =>
  screen.getByLabelText(new RegExp(`^${label}\\s*\\*`));

const fillRequired = async () => {
  await userEvent.type(requiredField('성함'), '홍길동');
  await userEvent.type(requiredField('소속'), '렛츠커리어');
  await userEvent.type(requiredField('직무'), '백엔드 개발');
  await userEvent.type(requiredField('연차'), '5');
  await userEvent.type(requiredField('전화번호'), '01012345678');
  await userEvent.type(requiredField('이메일'), 'mentor@example.com');
  await userEvent.click(screen.getByRole('checkbox', { name: '전화번호' }));
  await userEvent.click(screen.getByLabelText('데이터·AI'));
  await userEvent.click(screen.getByLabelText('서류 첨삭'));
  await userEvent.click(
    screen.getByLabelText(/개인정보 수집·이용에 동의합니다/),
  );
};

const readText = (blob: Blob) =>
  new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsText(blob);
  });

const submit = () =>
  userEvent.click(screen.getByRole('button', { name: '신청서 제출하기' }));

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

beforeEach(() => {
  post.mockReset();
  window.dataLayer = [];
});

describe('MentorApplyForm', () => {
  it('request JSON 파트와 file 파트로 multipart 를 보낸다', async () => {
    post.mockResolvedValue({ data: { data: { applicationId: 7 } } });
    const onSubmitted = renderForm();
    await fillRequired();
    const pdf = new File(['%PDF'], 'resume.pdf', { type: 'application/pdf' });
    await userEvent.upload(screen.getByLabelText(/이력서 \/ 포트폴리오/), pdf);

    await submit();

    await waitFor(() => expect(onSubmitted).toHaveBeenCalledWith(7));
    const [url, body, config] = post.mock.calls[0];
    expect(url).toBe('/mentor-application');
    expect(config.headers['Content-Type']).toBe('multipart/form-data');

    const request = (body as FormData).get('request') as Blob;
    expect(request.type).toBe('application/json');
    expect(JSON.parse(await readText(request))).toEqual({
      name: '홍길동',
      company: '렛츠커리어',
      jobTitle: '백엔드 개발',
      yearsOfExperience: 5,
      phoneNum: '01012345678',
      email: 'mentor@example.com',
      preferredContactMethods: ['PHONE'],
      jobFields: ['DATA_AI'],
      mentoringTypes: ['DOCUMENT_REVIEW'],
      snsLinks: [],
      privacyAgreed: true,
    });
    expect((body as FormData).get('file')).toBe(pdf);
  });

  it('첨부가 없으면 file 파트를 보내지 않는다', async () => {
    post.mockResolvedValue({ data: { data: { applicationId: 8 } } });
    const onSubmitted = renderForm();
    await fillRequired();

    await submit();

    await waitFor(() => expect(onSubmitted).toHaveBeenCalledWith(8));
    expect((post.mock.calls[0][1] as FormData).has('file')).toBe(false);
  });

  it('제출 중에는 버튼을 막는다', async () => {
    post.mockReturnValue(new Promise(() => {}));
    renderForm();
    await fillRequired();

    await submit();

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: '신청서 제출하기' }),
      ).toBeDisabled(),
    );
  });

  it('실패하면 입력값을 유지하고 에러를 알린다', async () => {
    post.mockRejectedValue(new Error('500'));
    const onSubmitted = renderForm();
    await fillRequired();

    await submit();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '제출에 실패했어요. 잠시 후 다시 시도해 주세요.',
    );
    expect(requiredField('성함')).toHaveValue('홍길동');
    expect(requiredField('전화번호')).toHaveValue('010-1234-5678');
    expect(screen.getByLabelText('데이터·AI')).toBeChecked();
    expect(
      screen.getByRole('button', { name: '신청서 제출하기' }),
    ).toBeEnabled();
    expect(onSubmitted).not.toHaveBeenCalled();
    expect(window.dataLayer).toEqual([]);
  });

  it('서버가 첨부를 거절하면 첨부 필드에 에러를 띄운다', async () => {
    post.mockRejectedValue({ code: 'MENTOR_APPLICATION_ATTACHMENT_TOO_LARGE' });
    renderForm();
    await fillRequired();

    await submit();

    expect(
      await screen.findByText('10MB 이하 파일만 첨부해 주세요.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('성공하면 dataLayer 에 제출 이벤트를 남긴다', async () => {
    post.mockResolvedValue({ data: { data: { applicationId: 9 } } });
    const onSubmitted = renderForm();
    await fillRequired();

    await submit();

    await waitFor(() => expect(onSubmitted).toHaveBeenCalled());
    expect(window.dataLayer).toEqual([
      { event: 'mentor_apply_submit', application_id: 9 },
    ]);
  });
});

describe('서류 정리 첨부', () => {
  const documents = [
    {
      userDocumentId: 11,
      userDocumentType: 'RESUME',
      fileName: '이력서.pdf',
      fileUrl: 'https://cdn.example.com/11.pdf',
    },
    {
      userDocumentId: 12,
      userDocumentType: 'PERSONAL_STATEMENT',
      fileName: '자소서.docx',
      fileUrl: 'https://cdn.example.com/12.docx',
    },
    {
      userDocumentId: 13,
      userDocumentType: 'PORTFOLIO',
      fileName: null,
      fileUrl: 'https://cdn.example.com/portfolio.pdf?v=2',
    },
  ];

  beforeEach(() => {
    useAuthStore.setState({ isLoggedIn: true });
    get.mockImplementation(async (url: string) => ({
      data: {
        data:
          url === '/user-document'
            ? { userDocumentList: documents }
            : url === '/user'
              ? null
              : {
                  userCareers: [],
                  pageInfo: {
                    pageNum: 0,
                    pageSize: 1,
                    totalElements: 0,
                    totalPages: 0,
                  },
                },
      },
    }));
  });

  afterEach(() => {
    useAuthStore.setState({ isLoggedIn: false });
    get.mockReset();
  });

  const chooseDocumentSource = () =>
    userEvent.click(screen.getByRole('radio', { name: '서류 정리에서 선택' }));

  it('비로그인이면 첨부 방식을 고르지 않고 업로드만 보인다', () => {
    useAuthStore.setState({ isLoggedIn: false });
    renderForm();

    expect(
      screen.queryByRole('radio', { name: '서류 정리에서 선택' }),
    ).not.toBeInTheDocument();
    expect(get).not.toHaveBeenCalled();
  });

  it('PDF 문서만 목록에 보인다', async () => {
    renderForm();
    await chooseDocumentSource();

    expect(
      await screen.findByRole('radio', { name: '이력서.pdf' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: 'portfolio.pdf' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('radio', { name: '자소서.docx' }),
    ).not.toBeInTheDocument();
  });

  it('문서를 고르면 userDocumentId 로 보내고 file 은 보내지 않는다', async () => {
    post.mockResolvedValue({ data: { data: { applicationId: 21 } } });
    const onSubmitted = renderForm();
    await fillRequired();
    const pdf = new File(['%PDF'], 'new.pdf', { type: 'application/pdf' });
    await userEvent.upload(screen.getByLabelText(/이력서 \/ 포트폴리오/), pdf);

    await chooseDocumentSource();
    await userEvent.click(
      await screen.findByRole('radio', { name: '이력서.pdf' }),
    );
    await submit();

    await waitFor(() => expect(onSubmitted).toHaveBeenCalledWith(21));
    const body = post.mock.calls[0][1] as FormData;
    const request = JSON.parse(await readText(body.get('request') as Blob));
    expect(request.userDocumentId).toBe(11);
    expect(body.has('file')).toBe(false);
  });

  it('다시 업로드로 바꾸면 고른 문서를 비우고 file 로 보낸다', async () => {
    post.mockResolvedValue({ data: { data: { applicationId: 22 } } });
    const onSubmitted = renderForm();
    await fillRequired();

    await chooseDocumentSource();
    await userEvent.click(
      await screen.findByRole('radio', { name: '이력서.pdf' }),
    );
    await userEvent.click(
      screen.getByRole('radio', { name: '새 파일 올리기' }),
    );
    const pdf = new File(['%PDF'], 'new.pdf', { type: 'application/pdf' });
    await userEvent.upload(screen.getByLabelText(/이력서 \/ 포트폴리오/), pdf);
    await submit();
    await waitFor(() => expect(onSubmitted).toHaveBeenCalledWith(22));
    const body = post.mock.calls[0][1] as FormData;
    const request = JSON.parse(await readText(body.get('request') as Blob));
    expect(request).not.toHaveProperty('userDocumentId');
    expect(body.get('file')).toBe(pdf);
  });
});
