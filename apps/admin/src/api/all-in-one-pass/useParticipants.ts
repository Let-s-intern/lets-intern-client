import { AdminRefundRequest } from '@/api/adminRefund';
import { useMutation, useQuery } from '@tanstack/react-query';

import { participantStore } from './mock/participantStore';
import { mockDelay } from './mock/passStore';

// 올인원패스 참여자 조회/환불. mock — 스펙 나오면 각 함수 본문만 axios로 교체.
// (환불은 기존 POST /admin/application/{id}/refund 재사용 예정)

export const participantListQueryKey = 'allInOnePassParticipantList';

type MutationCallbacks = {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
};

export const useGetParticipantsQuery = (passId?: number) =>
  useQuery({
    enabled: passId !== undefined,
    queryKey: [participantListQueryKey, passId],
    queryFn: () =>
      mockDelay(
        [...participantStore.list].sort((a, b) =>
          b.createDate.localeCompare(a.createDate),
        ),
      ),
  });

// 환불(전체/부분) mock: originalPrice에 원결제액 보존 + finalPrice에 환불액 → refundState가 전체/부분 판정
export const useRefundParticipantMutation = ({
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
