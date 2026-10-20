import { PassFormInput } from '@/domain/all-in-one-pass/types';
import {
  toCreateDto,
  toUpdateDto,
} from '@/domain/all-in-one-pass/util/allInOnePassMapper';
import axios from '@/utils/axios';
import { useMutation } from '@tanstack/react-query';

/**
 * 올인원패스(멤버십) 생성/수정 뮤테이션.
 *
 * 생성은 plan/option/faq 를 한 번에 POST. 수정(PATCH)은 basic + faq + planList
 * 를 함께 보내 플랜·권한을 full-sync 한다(생성/수정/권한 add·remove 자동 반영).
 * 플랜 "삭제"만 planList 로 처리되지 않아 전용 DELETE 엔드포인트를 쓴다.
 * 자료집은 별도 글로벌 풀(useBenefits)로 관리.
 */

type MutationCallbacks = {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
};

export const useCreateAllInOnePassMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async (input: PassFormInput) => {
      const res = await axios.post('/admin/membership', toCreateDto(input));
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });

export const useUpdateAllInOnePassMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async ({ id, input }: { id: number; input: PassFormInput }) => {
      const res = await axios.patch(
        `/admin/membership/${id}`,
        toUpdateDto(input),
      );
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });

/** 플랜 삭제 (DELETE /membership/{id}/plan/{planId}) */
export const useDeleteAllInOnePassPlanMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async ({
      membershipId,
      planId,
    }: {
      membershipId: number;
      planId: number;
    }) => {
      const res = await axios.delete(
        `/admin/membership/${membershipId}/plan/${planId}`,
      );
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
