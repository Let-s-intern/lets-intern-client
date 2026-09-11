import { AdminRefundRequest } from '@/api/adminRefund';
import { useMutation, useQuery } from '@tanstack/react-query';

import { mockDelay } from './mock/passStore';
import { participantStore } from './mock/participantStore';

/**
 * 올인원패스 참여자 조회/환불 훅.
 * 현재는 mock 스토어를 읽고 쓰며, 백엔드 스펙이 나오면 각 함수 본문만 axios 로
 * 교체하고 ./mock 을 삭제한다. (환불은 기존 POST /admin/application/{id}/refund 재사용 예정)
 */

export const passParticipantListQueryKey = 'allInOnePassParticipantList';

type MutationCallbacks = {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
};

export const useGetPassParticipantsQuery = (passId?: number) =>
  useQuery({
    enabled: passId !== undefined,
    queryKey: [passParticipantListQueryKey, passId],
    queryFn: () =>
      mockDelay(
        [...participantStore.list].sort((a, b) =>
          b.createDate.localeCompare(a.createDate),
        ),
      ),
  });

/**
 * 환불(전체/부분) mock. 실서버의 updateRefundPrice 흔적을 흉내낸다:
 * 원결제액을 originalPrice 로 보존하고 finalPrice 에 환불액을 남겨(전체=원결제액,
 * 부분=환불액) refundState 가 전체/부분을 판정할 수 있게 한다.
 */
export const useRefundPassParticipantMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: ({
      applicationId,
      body,
    }: {
      applicationId: number;
      body: AdminRefundRequest;
    }) => {
      const participant = participantStore.list.find(
        (p) => p.id === applicationId,
      );
      if (!participant)
        return Promise.reject(new Error('참여자를 찾을 수 없습니다.'));
      participant.originalPrice = participant.finalPrice;
      participant.finalPrice = body.refundAmount ?? participant.originalPrice;
      participant.isCanceled = true;
      participant.isAdminRefunded = true;
      return mockDelay(participant);
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
