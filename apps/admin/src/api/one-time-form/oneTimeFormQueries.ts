import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createOneTimeForm,
  deleteOneTimeForm,
  getOneTimeForm,
  getOneTimeFormApplication,
  getOneTimeFormApplications,
  getOneTimeFormFileUrl,
  getOneTimeForms,
  saveOneTimeFormOptionGroups,
  saveOneTimeFormQuestions,
  updateOneTimeForm,
} from './oneTimeForm';
import type {
  SaveOneTimeFormOptionGroupsRequest,
  SaveOneTimeFormQuestionsRequest,
  SaveOneTimeFormRequest,
} from './oneTimeFormSchema';

export const oneTimeFormQueryKeys = {
  all: ['adminOneTimeForm'] as const,
  list: () => [...oneTimeFormQueryKeys.all, 'list'] as const,
  detail: (formId: number) =>
    [...oneTimeFormQueryKeys.all, 'detail', formId] as const,
  applications: (formId: number) =>
    [...oneTimeFormQueryKeys.all, 'applications', formId] as const,
  application: (applicationId: number) =>
    [...oneTimeFormQueryKeys.all, 'application', applicationId] as const,
  fileUrl: (applicationId: number, questionId: number) =>
    [
      ...oneTimeFormQueryKeys.all,
      'fileUrl',
      applicationId,
      questionId,
    ] as const,
};

/** 서명 URL 은 10분 뒤 만료된다. 만료 전에 새로 받도록 그보다 짧게 둔다 */
const FILE_URL_STALE_TIME = 9 * 60 * 1000;

export const useOneTimeFormListQuery = () =>
  useQuery({
    queryKey: oneTimeFormQueryKeys.list(),
    queryFn: getOneTimeForms,
  });

export const useOneTimeFormDetailQuery = (formId: number) =>
  useQuery({
    queryKey: oneTimeFormQueryKeys.detail(formId),
    queryFn: () => getOneTimeForm(formId),
  });

export const useOneTimeFormApplicationsQuery = (formId: number) =>
  useQuery({
    queryKey: oneTimeFormQueryKeys.applications(formId),
    queryFn: () => getOneTimeFormApplications(formId),
  });

export const useOneTimeFormApplicationQuery = (applicationId: number) =>
  useQuery({
    queryKey: oneTimeFormQueryKeys.application(applicationId),
    queryFn: () => getOneTimeFormApplication(applicationId),
  });

/** 이미지 미리보기용. 파일 열기는 누를 때마다 `getOneTimeFormFileUrl` 로 새로 받는다 */
export const useOneTimeFormFileUrlQuery = (
  applicationId: number,
  questionId: number,
) =>
  useQuery({
    queryKey: oneTimeFormQueryKeys.fileUrl(applicationId, questionId),
    queryFn: () => getOneTimeFormFileUrl(applicationId, questionId),
    staleTime: FILE_URL_STALE_TIME,
  });

export const useCreateOneTimeFormMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOneTimeForm,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: oneTimeFormQueryKeys.list() }),
  });
};

export const useUpdateOneTimeFormMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      formId,
      body,
    }: {
      formId: number;
      body: SaveOneTimeFormRequest;
    }) => updateOneTimeForm(formId, body),
    // 목록의 제목·공개·기간도 바뀐다
    onSuccess: (_, { formId }) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: oneTimeFormQueryKeys.list(),
        }),
        queryClient.invalidateQueries({
          queryKey: oneTimeFormQueryKeys.detail(formId),
        }),
      ]),
  });
};

export const useDeleteOneTimeFormMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOneTimeForm,
    onSuccess: (_, formId) => {
      queryClient.removeQueries({
        queryKey: oneTimeFormQueryKeys.detail(formId),
      });
      return queryClient.invalidateQueries({
        queryKey: oneTimeFormQueryKeys.list(),
      });
    },
  });
};

export const useSaveOneTimeFormQuestionsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      formId,
      body,
    }: {
      formId: number;
      body: SaveOneTimeFormQuestionsRequest;
    }) => saveOneTimeFormQuestions(formId, body),
    onSuccess: (_, { formId }) =>
      queryClient.invalidateQueries({
        queryKey: oneTimeFormQueryKeys.detail(formId),
      }),
  });
};

export const useSaveOneTimeFormOptionGroupsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      formId,
      body,
    }: {
      formId: number;
      body: SaveOneTimeFormOptionGroupsRequest;
    }) => saveOneTimeFormOptionGroups(formId, body),
    onSuccess: (_, { formId }) =>
      queryClient.invalidateQueries({
        queryKey: oneTimeFormQueryKeys.detail(formId),
      }),
  });
};
