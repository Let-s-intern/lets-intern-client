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
 * 생성은 plan/faq 를 한 번에 전송(POST), 수정(PATCH)은 basic + faq.
 * (플랜은 서버 수정 엔드포인트가 없어 개설 후 변경 불가. 자료집은
 * 별도 글로벌 풀(useBenefits)로 관리)
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
