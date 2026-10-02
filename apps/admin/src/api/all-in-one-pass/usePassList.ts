import {
  toCreateDto,
  toFormInput,
  toListItem,
} from '@/domain/all-in-one-pass/util/membershipMapper';
import axios from '@/utils/axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  membershipDetailSchema,
  membershipListResponseSchema,
} from './membershipSchema';

/**
 * 올인원패스(멤버십) 목록/노출/삭제 훅.
 *
 * 서버: /api/v1/admin/membership. 페이지는 이 파일만 import 한다.
 */

type MutationCallbacks = {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
};

export const allInOnePassListQueryKey = 'allInOnePassList';

/** 개설 목록 (현재 서버 페이지네이션 미노출 — 넉넉히 1페이지로 조회) */
export const useGetAllInOnePassListQuery = () =>
  useQuery({
    queryKey: [allInOnePassListQueryKey],
    queryFn: async () => {
      const res = await axios.get('/admin/membership', {
        params: { page: 1, size: 100 },
      });
      const parsed = membershipListResponseSchema.parse(res.data.data);
      return parsed.membershipList.map(toListItem);
    },
  });

/** 노출 여부 토글 (PATCH membership) */
export const usePatchAllInOnePassVisibleMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async ({
      id,
      isVisible,
    }: {
      id: number;
      isVisible: boolean;
    }) => {
      const res = await axios.patch(`/admin/membership/${id}`, { isVisible });
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });

export const useDeleteAllInOnePassMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/admin/membership/${id}`);
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });

/**
 * 복제: 복제 전용 API가 없어, 원본 상세를 조회해 생성(POST)을 다시 호출한다.
 * (가이드북 복제와 동일 방식) 제목에 "(복제)"를 붙이고 비노출로 생성된다.
 */
export const useDuplicateAllInOnePassMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async (id: number) => {
      const detailRes = await axios.get(`/admin/membership/${id}`);
      const input = toFormInput(
        membershipDetailSchema.parse(detailRes.data.data),
      );
      const body = toCreateDto({ ...input, title: `${input.title} (복제)` });
      const res = await axios.post('/admin/membership', body);
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
