jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

// 자동 채우기가 `@/api/user/user` 를 물고 오므로 그 모듈의 v2 네트워크 계층(`import.meta`)을 막는다
jest.mock('@/utils/axiosV2', () => ({ __esModule: true, default: {} }));

import useAuthStore from '@/store/useAuthStore';
import axios from '@/utils/axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MentorApplyForm from '../MentorApplyForm';

const get = axios.get as jest.Mock;

const user = {
  userId: 1,
  id: null,
  name: '홍길동',
  email: 'login@example.com',
  contactEmail: 'contact@example.com',
  phoneNum: '01012345678',
  university: null,
  inflowPath: null,
  grade: null,
  major: null,
  wishField: null,
  wishJob: null,
  wishIndustry: null,
  wishEmploymentType: null,
  wishCompany: null,
  accountType: null,
  accountNum: null,
  marketingAgree: null,
  authProvider: null,
  role: null,
  careerType: null,
  memo: null,
  isPoolUp: null,
  sns: JSON.stringify([
    'https://a.example.com',
    'https://b.example.com',
    'https://c.example.com',
    'https://d.example.com',
  ]),
};

const pageInfo = { pageNum: 0, pageSize: 1, totalElements: 1, totalPages: 1 };

type Responses = { user?: unknown; careers?: unknown[] };

/** 응답을 미뤄 두었다가 `resolve` 로 도착시킨다 */
const mockApi = ({ user: u = user, careers = [] }: Responses = {}) => {
  const pending: Record<string, () => void> = {};
  get.mockImplementation(
    (url: string) =>
      new Promise((resolve) => {
        const data = url.startsWith('/user-career/my')
          ? { userCareers: careers, pageInfo }
          : url === '/user'
            ? u
            : { userDocumentList: [] };
        const key = url.split('?')[0];
        pending[key] = () => resolve({ data: { data } });
      }),
  );
  return {
    resolve: async (key: string) => {
      await waitFor(() => expect(pending[key]).toBeDefined());
      pending[key]();
    },
  };
};

const renderForm = () =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <MentorApplyForm onSubmitted={jest.fn()} />
    </QueryClientProvider>,
  );

const requiredField = (label: string) =>
  screen.getByLabelText(new RegExp(`^${label}\\s*\\*`));

beforeEach(() => {
  get.mockReset();
  useAuthStore.setState({ isLoggedIn: true });
});

afterAll(() => {
  useAuthStore.setState({ isLoggedIn: false });
});

describe('usePrefillFromUser', () => {
  it('비로그인이면 회원 정보와 경력을 부르지 않는다', () => {
    useAuthStore.setState({ isLoggedIn: false });
    mockApi();
    renderForm();

    expect(get).not.toHaveBeenCalled();
    expect(requiredField('성함')).toHaveValue('');
  });

  it('회원 정보와 최신 경력으로 채운다', async () => {
    const api = mockApi({
      careers: [{ id: 3, company: '렛츠커리어', job: '백엔드 개발' }],
    });
    renderForm();

    await api.resolve('/user');
    await api.resolve('/user-career/my');

    await waitFor(() => expect(requiredField('성함')).toHaveValue('홍길동'));
    expect(requiredField('전화번호')).toHaveValue('010-1234-5678');
    expect(requiredField('이메일')).toHaveValue('contact@example.com');
    expect(screen.getByLabelText('SNS 1')).toHaveValue('https://a.example.com');
    expect(screen.getByLabelText('SNS 3')).toHaveValue('https://c.example.com');
    await waitFor(() =>
      expect(requiredField('소속')).toHaveValue('렛츠커리어'),
    );
    expect(requiredField('직무')).toHaveValue('백엔드 개발');
    expect(get).toHaveBeenCalledWith(
      '/user-career/my?page=0&size=1&sort=desc&sortType=START_DATE',
    );
  });

  it('contactEmail 이 없으면 로그인 이메일을 쓴다', async () => {
    const api = mockApi({ user: { ...user, contactEmail: null } });
    renderForm();

    await api.resolve('/user');

    await waitFor(() =>
      expect(requiredField('이메일')).toHaveValue('login@example.com'),
    );
  });

  it('데이터가 오기 전에 사용자가 고친 필드는 덮지 않는다', async () => {
    const api = mockApi({
      careers: [{ id: 3, company: '렛츠커리어', job: '백엔드 개발' }],
    });
    renderForm();

    await userEvent.type(requiredField('성함'), '김철수');
    await userEvent.type(requiredField('소속'), '다른회사');
    await api.resolve('/user');
    await api.resolve('/user-career/my');

    await waitFor(() =>
      expect(requiredField('이메일')).toHaveValue('contact@example.com'),
    );
    await waitFor(() =>
      expect(requiredField('직무')).toHaveValue('백엔드 개발'),
    );
    expect(requiredField('성함')).toHaveValue('김철수');
    expect(requiredField('소속')).toHaveValue('다른회사');
  });

  it('경력이 없으면 소속과 직무를 비워 둔다', async () => {
    const api = mockApi({ careers: [] });
    renderForm();

    await api.resolve('/user');
    await api.resolve('/user-career/my');

    await waitFor(() => expect(requiredField('성함')).toHaveValue('홍길동'));
    expect(requiredField('소속')).toHaveValue('');
    expect(requiredField('직무')).toHaveValue('');
  });
});
