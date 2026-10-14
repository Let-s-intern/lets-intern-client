import {
  PassFormInput,
  PassPermission,
  PassPlan,
} from '@/domain/all-in-one-pass/types';
import {
  permissionToPrivilegeDto,
  planToUpdateDto,
  toCreateDto,
  toUpdateDto,
} from '@/domain/all-in-one-pass/util/allInOnePassMapper';
import axios from '@/utils/axios';
import { useMutation } from '@tanstack/react-query';

/**
 * 올인원패스(멤버십) 생성/수정 뮤테이션.
 *
 * 생성은 plan/faq 를 한 번에 전송(POST), 수정(PATCH)은 basic + faq.
 * 기존 플랜 기본정보 수정은 별도 PATCH 엔드포인트로 반영한다(권한 변경·플랜
 * 추가/삭제는 BE 스펙 확정 후). 자료집은 별도 글로벌 풀(useBenefits)로 관리.
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

/** 기존 플랜 기본정보 수정 (PATCH /membership/{id}/plan/{planId}) */
export const useUpdateAllInOnePassPlanMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async ({
      membershipId,
      planId,
      plan,
    }: {
      membershipId: number;
      planId: number;
      plan: PassPlan;
    }) => {
      const res = await axios.patch(
        `/admin/membership/${membershipId}/plan/${planId}`,
        planToUpdateDto(plan),
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

/**
 * 플랜 권한 수정 (PATCH .../privilege/{privilegeId}).
 * 기존 권한 슬롯을 다른 권한으로 바꿔치기(교체)할 때 사용.
 */
export const useUpdateAllInOnePassPlanPrivilegeMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async ({
      membershipId,
      planId,
      privilegeId,
      permission,
    }: {
      membershipId: number;
      planId: number;
      privilegeId: number;
      permission: PassPermission;
    }) => {
      const res = await axios.patch(
        `/admin/membership/${membershipId}/plan/${planId}/privilege/${privilegeId}`,
        permissionToPrivilegeDto(permission),
      );
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });

/** 플랜 권한 삭제 (DELETE .../privilege/{privilegeId}) */
export const useDeleteAllInOnePassPlanPrivilegeMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: async ({
      membershipId,
      planId,
      privilegeId,
    }: {
      membershipId: number;
      planId: number;
      privilegeId: number;
    }) => {
      const res = await axios.delete(
        `/admin/membership/${membershipId}/plan/${planId}/privilege/${privilegeId}`,
      );
      return res.data;
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
