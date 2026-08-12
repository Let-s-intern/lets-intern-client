import axiosV2 from '@/utils/axiosV2';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  CreateSsoRedirectWhitelistReq,
  ssoRedirectWhitelistListSchema,
  UpdateSsoRedirectWhitelistReq,
} from './ssoSchema';

/**
 * SSO 리다이렉트 화이트리스트 어드민 API (LC-3208, PRD 6.3).
 *
 * 경로가 `/api/v2/admin/**` 이라 서버 시큐리티가 자동으로 ADMIN 권한을 요구한다
 * (server Push 1). 그래서 v1 이 아니라 `axiosV2` 로 부른다.
 */
const REDIRECT_WHITELIST_PATH = '/admin/sso/redirect-whitelist';

export const ssoRedirectWhitelistQueryKey = ['sso', 'redirect-whitelist'];

export const useSsoRedirectWhitelistListQuery = () =>
  useQuery({
    queryKey: ssoRedirectWhitelistQueryKey,
    queryFn: async () => {
      const res = await axiosV2.get(REDIRECT_WHITELIST_PATH);
      return ssoRedirectWhitelistListSchema.parse(res.data.data);
    },
  });

interface MutationCallbacks {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
}

export const useCreateSsoRedirectWhitelist = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreateSsoRedirectWhitelistReq) => {
      const res = await axiosV2.post(REDIRECT_WHITELIST_PATH, req);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ssoRedirectWhitelistQueryKey });
      successCallback?.();
    },
    onError: (error: Error) => errorCallback?.(error),
  });
};

export const useToggleSsoRedirectWhitelistActive = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: UpdateSsoRedirectWhitelistReq) => {
      const res = await axiosV2.patch(`${REDIRECT_WHITELIST_PATH}/${id}`, {
        isActive,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ssoRedirectWhitelistQueryKey });
      successCallback?.();
    },
    onError: (error: Error) => errorCallback?.(error),
  });
};

export const useDeleteSsoRedirectWhitelist = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosV2.delete(`${REDIRECT_WHITELIST_PATH}/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ssoRedirectWhitelistQueryKey });
      successCallback?.();
    },
    onError: (error: Error) => errorCallback?.(error),
  });
};
