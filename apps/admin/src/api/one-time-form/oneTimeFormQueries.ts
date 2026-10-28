import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createOneTimeForm,
  deleteOneTimeForm,
  getOneTimeForm,
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
};

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
