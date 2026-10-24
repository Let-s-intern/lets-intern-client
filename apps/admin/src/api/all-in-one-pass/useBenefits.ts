import axios from '@/utils/axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { allInOnePassBenefitListResponseSchema } from './allInOnePassSchema';

/** 자료집(혜택) 글로벌 풀 CRUD 훅. 서버: /api/v1/admin/membership/benefit. */

type MutationCallbacks = {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
};

export interface BenefitFormValues {
  title: string;
  type: string;
  introduction: string;
  link: string;
  thumbnail: string | null;
}

export const allInOnePassBenefitListQueryKey = 'allInOnePassBenefitList';

export const useGetAllInOnePassBenefitListQuery = () =>
  useQuery({
    queryKey: [allInOnePassBenefitListQueryKey],
    queryFn: async () => {
      const res = await axios.get('/admin/membership/benefit');
      return allInOnePassBenefitListResponseSchema.parse(res.data.data);
    },
  });

export const useCreateAllInOnePassBenefitMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async (values: BenefitFormValues) => {
      const res = await axios.post('/admin/membership/benefit', values);
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });

export const useUpdateAllInOnePassBenefitMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: number;
      values: BenefitFormValues;
    }) => {
      const res = await axios.patch(`/admin/membership/benefit/${id}`, values);
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });

export const useDeleteAllInOnePassBenefitMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/admin/membership/benefit/${id}`);
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });

/**
 * 노출 영역 수정: 이 자료집을 노출할 패스(membershipIds)로 교체.
 * 공지의 노출 PATCH와 동일 스펙 — BE 엔드포인트 반영 후 동작.
 */
export const useUpdateAllInOnePassBenefitExposureMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async ({
      membershipBenefitId,
      membershipIds,
    }: {
      membershipBenefitId: number;
      membershipIds: number[];
    }) => {
      const res = await axios.patch('/admin/membership/benefit', {
        membershipBenefitId,
        membershipIds,
      });
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
