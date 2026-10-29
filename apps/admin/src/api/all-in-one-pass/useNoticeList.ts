import axios from '@/utils/axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AllInOnePassNotice,
  AllInOnePassNoticeType,
  allInOnePassNoticeListResponseSchema,
} from './allInOnePassSchema';

/**
 * 공지·가이드 CRUD 훅. 서버: /api/v1/admin/membership_notice.
 * 삭제는 soft-hide(isVisible=false)라, 목록은 노출 항목만 노출.
 */

type MutationCallbacks = {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
};

export type NoticeFormValues = Pick<
  AllInOnePassNotice,
  'type' | 'title' | 'contents'
>;

export const allInOnePassNoticeListQueryKey = 'allInOnePassNoticeList';

/** 공지·가이드 목록 (노출 항목만). type 지정 시 해당 유형만. */
export const useGetAllInOnePassNoticeListQuery = (
  type?: AllInOnePassNoticeType,
) =>
  useQuery({
    queryKey: [allInOnePassNoticeListQueryKey, type ?? 'ALL'],
    queryFn: async () => {
      const res = await axios.get('/admin/membership_notice', {
        params: type ? { types: type } : undefined,
      });
      return allInOnePassNoticeListResponseSchema
        .parse(res.data.data)
        .filter((n) => n.isVisible);
    },
  });

export const useCreateAllInOnePassNoticeMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async (values: NoticeFormValues) => {
      const res = await axios.post('/admin/membership_notice', values);
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });

export const useUpdateAllInOnePassNoticeMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: number;
      values: NoticeFormValues;
    }) => {
      const res = await axios.patch(`/admin/membership_notice/${id}`, values);
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });

/** 삭제(숨김): isVisible=false 로 변경 */
export const useDeleteAllInOnePassNoticeMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/admin/membership_notice/${id}`);
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });

/** 노출 영역 수정: 이 공지를 노출할 패스(membershipIds)로 교체 */
export const useUpdateAllInOnePassNoticeExposureMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async ({
      membershipNoticeId,
      membershipIds,
    }: {
      membershipNoticeId: number;
      membershipIds: number[];
    }) => {
      const res = await axios.patch('/admin/membership_notice', {
        membershipNoticeId,
        membershipIds,
      });
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
