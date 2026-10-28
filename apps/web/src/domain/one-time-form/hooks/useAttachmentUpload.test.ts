import { fetchOneTimeFormUploadUrl } from '@/api/one-time-form/oneTimeForm';
// 패키지 entry(@letscareer/api) 는 jest 에서 import.meta 로 깨진다. ApiError 만 서브경로로 가져온다
import { ApiError } from '@letscareer/api/errors';
import { act, renderHook } from '@testing-library/react';
import { putAttachmentFile } from '../api/putAttachmentFile';
import { useAttachmentUpload } from './useAttachmentUpload';

jest.mock('@/api/one-time-form/oneTimeForm', () => {
  const { ApiError: MockApiError } = jest.requireActual<
    typeof import('@letscareer/api/errors')
  >('@letscareer/api/errors');
  return {
    fetchOneTimeFormUploadUrl: jest.fn(),
    getOneTimeFormErrorCode: (error: unknown) =>
      error instanceof MockApiError ? error.code : undefined,
  };
});

jest.mock('../api/putAttachmentFile', () => ({
  putAttachmentFile: jest.fn(),
}));

const mockFetchUrl = fetchOneTimeFormUploadUrl as jest.Mock;
const mockPut = putAttachmentFile as jest.Mock;

const MB = 1024 * 1024;
const UPLOAD_URL =
  'https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/one-time-form/attachment/7/0b5c.pdf?X-Amz-Signature=x';
const KEY = 'one-time-form/attachment/7/0b5c.pdf';

const makeFile = (name: string, size = MB) => {
  const file = new File(['x'], name);
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

const setup = (kind: 'IMAGE' | 'FILE' = 'FILE') => {
  const onUploaded = jest.fn();
  const hook = renderHook(() =>
    useAttachmentUpload({
      slug: 'portfolio-1115',
      questionId: 110,
      kind,
      onUploaded,
    }),
  );
  return { ...hook, onUploaded };
};

beforeEach(() => {
  jest.clearAllMocks();
  mockFetchUrl.mockResolvedValue({ uploadUrl: UPLOAD_URL, key: KEY });
  mockPut.mockResolvedValue(undefined);
});

describe('useAttachmentUpload', () => {
  it('URL 을 받아 PUT 하고, 끝나면 { key, name: 원본 파일명 } 을 넘긴다', async () => {
    const { result, onUploaded } = setup();
    const file = makeFile('김렛커_이력서_최종.pdf');

    await act(() => result.current.upload(file));

    expect(mockFetchUrl).toHaveBeenCalledWith({
      slug: 'portfolio-1115',
      questionId: 110,
      filename: '김렛커_이력서_최종.pdf',
    });
    expect(mockPut).toHaveBeenCalledWith(
      expect.objectContaining({ uploadUrl: UPLOAD_URL, file }),
    );
    const value = { key: KEY, name: '김렛커_이력서_최종.pdf' };
    expect(result.current.state).toEqual({ status: 'done', file, value });
    expect(onUploaded).toHaveBeenCalledWith(value);
  });

  it('올리는 동안 진행률을 상태에 담는다', async () => {
    let finishPut: () => void = () => {};
    mockPut.mockImplementation(
      ({ onProgress }: { onProgress: (percent: number) => void }) =>
        new Promise<void>((resolve) => {
          onProgress(40);
          finishPut = resolve;
        }),
    );
    const { result } = setup();
    const file = makeFile('a.pdf');

    let pending: Promise<void> = Promise.resolve();
    await act(async () => {
      pending = result.current.upload(file);
    });
    expect(result.current.state).toEqual({
      status: 'uploading',
      file,
      progress: 40,
    });

    await act(async () => {
      finishPut();
      await pending;
    });
    expect(result.current.state.status).toBe('done');
  });

  it('PUT 이 실패하면 오류를 보여 주고, 다시 시도하면 같은 파일로 성공한다', async () => {
    mockPut.mockRejectedValueOnce(new Error('Network Error'));
    const { result, onUploaded } = setup();
    const file = makeFile('a.pdf');

    await act(() => result.current.upload(file));

    expect(result.current.state).toEqual({
      status: 'error',
      message: '업로드하지 못했어요. 다시 시도해 주세요.',
      retryFile: file,
    });
    expect(onUploaded).not.toHaveBeenCalled();

    await act(async () => {
      result.current.retry();
    });

    expect(mockFetchUrl).toHaveBeenCalledTimes(2);
    expect(result.current.state.status).toBe('done');
    expect(onUploaded).toHaveBeenCalledWith({ key: KEY, name: 'a.pdf' });
  });

  it('U4 가 기간 밖 에러를 주면 계약 문구를 띄우고 재시도는 막는다', async () => {
    mockFetchUrl.mockRejectedValueOnce(
      new ApiError({
        code: 'ONE_TIME_FORM_NOT_IN_PERIOD',
        message: '신청 기간이 아닙니다.',
        status: 400,
        endpoint: '/one-time-form/portfolio-1115/upload-url',
        method: 'GET',
        context: {},
      }),
    );
    const { result } = setup();

    await act(() => result.current.upload(makeFile('a.pdf')));

    expect(result.current.state).toEqual({
      status: 'error',
      message: '신청 기간이 아니어서 올릴 수 없어요.',
      retryFile: null,
    });
    expect(mockPut).not.toHaveBeenCalled();
  });

  it('용량을 넘으면 U4 를 부르지 않고 막는다', async () => {
    const { result } = setup('IMAGE');

    await act(() => result.current.upload(makeFile('a.png', 10 * MB + 1)));

    expect(result.current.state).toEqual({
      status: 'error',
      message: '10MB 이하 파일만 올릴 수 있어요.',
      retryFile: null,
    });
    expect(mockFetchUrl).not.toHaveBeenCalled();
  });

  it('확장자가 틀리면 U4 를 부르지 않고 막는다', async () => {
    const { result } = setup('FILE');

    await act(() => result.current.upload(makeFile('a.exe')));

    expect(result.current.state).toEqual({
      status: 'error',
      message: 'pdf, docx, pptx, hwp, zip 파일만 올릴 수 있어요.',
      retryFile: null,
    });
    expect(mockFetchUrl).not.toHaveBeenCalled();
  });

  it('올리는 중에 reset 하면 늦게 끝난 결과를 버린다', async () => {
    let finishPut: () => void = () => {};
    mockPut.mockImplementation(
      () => new Promise<void>((resolve) => (finishPut = resolve)),
    );
    const { result, onUploaded } = setup();

    let pending: Promise<void> = Promise.resolve();
    await act(async () => {
      pending = result.current.upload(makeFile('a.pdf'));
    });
    act(() => result.current.reset());
    await act(async () => {
      finishPut();
      await pending;
    });

    expect(result.current.state).toEqual({ status: 'idle' });
    expect(onUploaded).not.toHaveBeenCalled();
  });
});
