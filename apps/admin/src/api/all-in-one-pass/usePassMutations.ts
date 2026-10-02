import { PassBenefit, PassFormInput } from '@/domain/all-in-one-pass/types';
import {
  benefitToDto,
  toCreateDto,
  toUpdateDto,
} from '@/domain/all-in-one-pass/util/membershipMapper';
import axios from '@/utils/axios';
import { useMutation } from '@tanstack/react-query';

/**
 * 올인원패스(멤버십) 생성/수정 뮤테이션.
 *
 * 생성은 plan/benefit 를 한 번에 전송(POST), 수정(PATCH)은 basic 필드만.
 * 혜택은 수정 페이지에서 별도 benefit CRUD 엔드포인트로 diff 반영한다
 * (플랜은 서버 수정 엔드포인트가 없어 개설 후 변경 불가).
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

export const useSyncMembershipBenefitsMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async ({
      membershipId,
      original,
      current,
    }: {
      membershipId: number;
      original: PassBenefit[];
      current: PassBenefit[];
    }) => {
      const originalById = new Map(original.map((b) => [b.id, b]));
      const currentIds = new Set(current.map((b) => b.id));

      const toDelete = original.filter((b) => !currentIds.has(b.id));
      const toCreate = current.filter((b) => !originalById.has(b.id));
      const toUpdate = current.filter((b) => {
        const prev = originalById.get(b.id);
        return (
          prev &&
          JSON.stringify(benefitToDto(prev)) !== JSON.stringify(benefitToDto(b))
        );
      });

      await Promise.all([
        ...toDelete.map((b) =>
          axios.delete(`/admin/membership/${membershipId}/benefit/${b.id}`),
        ),
        ...toCreate.map((b) =>
          axios.post(
            `/admin/membership/${membershipId}/benefit`,
            benefitToDto(b),
          ),
        ),
        ...toUpdate.map((b) =>
          axios.patch(
            `/admin/membership/${membershipId}/benefit/${b.id}`,
            benefitToDto(b),
          ),
        ),
      ]);
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
