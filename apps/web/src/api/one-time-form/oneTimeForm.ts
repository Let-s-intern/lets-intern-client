import axios from '@/utils/axios';
import { ApiError } from '@letscareer/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateOneTimeFormApplicationRequest,
  CreateOneTimeFormApplicationResponse,
  MyOneTimeFormApplication,
  OneTimeForm,
  OneTimeFormUploadUrl,
  createOneTimeFormApplicationResponseSchema,
  myOneTimeFormApplicationSchema,
  oneTimeFormSchema,
  oneTimeFormUploadUrlSchema,
} from './oneTimeFormSchema';

const oneTimeFormQueryKey = 'OneTimeFormQueryKey';
const myOneTimeFormApplicationQueryKey = 'MyOneTimeFormApplicationQueryKey';

export const ONE_TIME_FORM_NOT_FOUND = 'ONE_TIME_FORM_NOT_FOUND';
export const ONE_TIME_FORM_ALREADY_APPLIED = 'ONE_TIME_FORM_ALREADY_APPLIED';

/**
 * 서버 에러 코드(계약 10절). axios 인터셉터가 응답 에러를 ApiError 로 감싸 던지므로
 * 그 code 를 읽는다. 네트워크 실패처럼 응답이 없으면 undefined.
 */
export const getOneTimeFormErrorCode = (error: unknown): string | undefined =>
  error instanceof ApiError ? error.code : undefined;

// U1 폼 조회 (공개)
export const fetchOneTimeForm = async (slug: string): Promise<OneTimeForm> => {
  const res = await axios.get(`/one-time-form/${slug}`);
  return oneTimeFormSchema.parse(res.data.data);
};

export const oneTimeFormQueryOptions = (slug: string) => ({
  queryKey: [oneTimeFormQueryKey, slug],
  queryFn: () => fetchOneTimeForm(slug),
});

export const useOneTimeFormQuery = (slug: string) => {
  return useQuery(oneTimeFormQueryOptions(slug));
};

// U2 내 신청 (로그인). 신청이 없으면 null
export const fetchMyOneTimeFormApplication = async (
  slug: string,
): Promise<MyOneTimeFormApplication> => {
  const res = await axios.get(`/one-time-form/${slug}/my`);
  return myOneTimeFormApplicationSchema.parse(res.data.data);
};

export const myOneTimeFormApplicationQueryOptions = (slug: string) => ({
  queryKey: [myOneTimeFormApplicationQueryKey, slug],
  queryFn: () => fetchMyOneTimeFormApplication(slug),
});

export const useMyOneTimeFormApplicationQuery = (
  slug: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    ...myOneTimeFormApplicationQueryOptions(slug),
    enabled: options?.enabled,
  });
};

// U3 신청 생성 (로그인)
export const postOneTimeFormApplication = async (
  slug: string,
  body: CreateOneTimeFormApplicationRequest,
): Promise<CreateOneTimeFormApplicationResponse> => {
  const res = await axios.post(`/one-time-form/${slug}/applications`, body);
  return createOneTimeFormApplicationResponseSchema.parse(res.data.data);
};

export const useCreateOneTimeFormApplicationMutation = (slug: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateOneTimeFormApplicationRequest) =>
      postOneTimeFormApplication(slug, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [myOneTimeFormApplicationQueryKey, slug],
      });
    },
  });
};

// U4 첨부 업로드 URL 발급 (로그인). 받은 uploadUrl 로 파일을 PUT 한다
export const fetchOneTimeFormUploadUrl = async ({
  slug,
  questionId,
  filename,
}: {
  slug: string;
  questionId: number;
  filename: string;
}): Promise<OneTimeFormUploadUrl> => {
  const res = await axios.get(`/one-time-form/${slug}/upload-url`, {
    params: { questionId, filename },
  });
  return oneTimeFormUploadUrlSchema.parse(res.data.data);
};

// U5 신청 취소 (기존 엔드포인트). 성공하면 U2 를 다시 불러 취소 완료 화면을 그린다
export const useCancelOneTimeFormApplicationMutation = (slug: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (applicationId: number) => {
      const res = await axios.delete(`/application/${applicationId}`, {
        params: { type: 'ONE_TIME_FORM' },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [myOneTimeFormApplicationQueryKey, slug],
      });
    },
  });
};
