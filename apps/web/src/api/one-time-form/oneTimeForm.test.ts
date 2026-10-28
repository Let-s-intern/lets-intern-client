/*
  `@/utils/axios`, `@letscareer/api` 는 `import.meta` 때문에 jest 가 파싱하지 못한다.
  검사 대상은 요청 경로뿐이므로 네트워크 계층과 응답 스키마를 목으로 막는다.
*/
import axios from '@/utils/axios';

import {
  fetchMyOneTimeFormApplication,
  fetchOneTimeForm,
  fetchOneTimeFormUploadUrl,
  postOneTimeFormApplication,
} from './oneTimeForm';
import { CreateOneTimeFormApplicationRequest } from './oneTimeFormSchema';

jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));
jest.mock('@letscareer/api', () => ({
  __esModule: true,
  ApiError: class ApiError extends Error {},
}));
jest.mock('./oneTimeFormSchema', () => {
  const passthrough = { parse: (value: unknown) => value };
  return {
    __esModule: true,
    oneTimeFormSchema: passthrough,
    myOneTimeFormApplicationSchema: passthrough,
    createOneTimeFormApplicationResponseSchema: passthrough,
    oneTimeFormUploadUrlSchema: passthrough,
  };
});

const mockedGet = axios.get as jest.Mock;
const mockedPost = axios.post as jest.Mock;

const MALICIOUS_SLUG = 'a/../b';
const ENCODED_BASE = '/one-time-form/a%2F..%2Fb';

describe('one-time-form API 는 slug 를 인코딩해 경로에 넣는다', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGet.mockResolvedValue({ data: { data: {} } });
    mockedPost.mockResolvedValue({ data: { data: {} } });
  });

  it('U1 폼 조회', async () => {
    await fetchOneTimeForm(MALICIOUS_SLUG);
    expect(mockedGet).toHaveBeenCalledWith(ENCODED_BASE);
  });

  it('U2 내 신청', async () => {
    await fetchMyOneTimeFormApplication(MALICIOUS_SLUG);
    expect(mockedGet).toHaveBeenCalledWith(`${ENCODED_BASE}/my`);
  });

  it('U3 신청 생성', async () => {
    const body = {} as CreateOneTimeFormApplicationRequest;
    await postOneTimeFormApplication(MALICIOUS_SLUG, body);
    expect(mockedPost).toHaveBeenCalledWith(
      `${ENCODED_BASE}/applications`,
      body,
    );
  });

  it('U4 업로드 URL 발급', async () => {
    await fetchOneTimeFormUploadUrl({
      slug: MALICIOUS_SLUG,
      questionId: 1,
      filename: 'a.pdf',
    });
    expect(mockedGet).toHaveBeenCalledWith(`${ENCODED_BASE}/upload-url`, {
      params: { questionId: 1, filename: 'a.pdf' },
    });
  });
});
