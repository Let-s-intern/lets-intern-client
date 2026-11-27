import { useRevokeParticipantMutation } from '@/api/all-in-one-pass/useParticipants';
import { useAdminRefundMutation } from '@/api/adminRefund';
import { UseUserDetailAdminQueryKey } from '@/api/user/user';
import RefundModal, {
  type RefundMode,
  type RefundTarget,
} from '@/domain/admin/program/program-user/ui/RefundModal';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import type { UserAdminDetail, UserApplicationDetailInfo } from '@/schema';
import { useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useMemo, useState } from 'react';
import {
  buildRefundTarget,
  canRevokeMembership,
  resolveRowRefund,
  splitPurchaseHistory,
} from '../utils/purchaseHistory';
import MembershipRevokeDialog from './MembershipRevokeDialog';
import PurchaseHistoryRow from './PurchaseHistoryRow';

interface Props {
  data: UserAdminDetail;
}

/**
 * 구매·참여 이력. 신청 하나당 한 행이고 참여중과 참여했던으로 나눈다.
 * 서버 배포 전 응답에는 상세가 없으므로 그때는 기존 제목 목록을 그대로 보인다.
 */
const PurchaseHistorySection = ({ data }: Props) => {
  const { snackbar } = useAdminSnackbar();
  const [refundRequest, setRefundRequest] = useState<{
    target: RefundTarget;
    mode: RefundMode;
  } | null>(null);
  // 성공하면 훅이 유저 상세 쿼리를 무효화해 행이 환불·취소됨으로 바뀐다.
  const refundMutation = useAdminRefundMutation({
    onSuccess: (refundedAmount) => {
      setRefundRequest(null);
      snackbar(`${refundedAmount.toLocaleString()}원이 환불되었습니다.`);
    },
    onError: (message) => snackbar(message),
  });

  // 올인원패스는 환불 API 가 따로 없어 권한 회수 호출을 쓴다. 이 훅은 유저 상세를 무효화하지 않으므로 성공 뒤 여기서 한다.
  const queryClient = useQueryClient();
  const [revokeTarget, setRevokeTarget] =
    useState<UserApplicationDetailInfo | null>(null);
  const revokeMutation = useRevokeParticipantMutation(
    revokeTarget?.programId ?? undefined,
  );
  const handleRevoke = () => {
    if (!revokeTarget || revokeTarget.membershipApplicationId == null) return;
    revokeMutation.mutate(revokeTarget.membershipApplicationId, {
      onSuccess: () => {
        setRevokeTarget(null);
        queryClient.invalidateQueries({
          queryKey: [UseUserDetailAdminQueryKey],
        });
        snackbar('이용 권한을 회수했습니다.');
      },
      onError: (error) =>
        snackbar(
          (isAxiosError<{ message?: string }>(error) &&
            error.response?.data?.message) ||
            '이용 권한 회수에 실패했습니다.',
        ),
    });
  };
  const detailList = data.applicationDetailInfo;
  const { current, past } = useMemo(
    () => splitPurchaseHistory(detailList ?? []),
    [detailList],
  );

  if (!detailList || detailList.length === 0) {
    return (
      <div className="flex flex-col gap-y-1">
        {data.applicationInfo.length < 1 ? (
          <div>신청 내역이 없습니다.</div>
        ) : (
          data.applicationInfo.map((applicationInfo, idx) => (
            <div key={data.userInfo.id + applicationInfo.programId + idx}>
              {applicationInfo.programTitle}
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-8">
      {[
        { title: '참여중', list: current },
        { title: '참여했던', list: past },
      ].map(({ title, list }) => (
        <section key={title}>
          <h2 className="border-b pb-2 text-lg font-semibold">
            {title} ({list.length})
          </h2>
          {list.length === 0 ? (
            <div className="mt-3 text-sm text-neutral-500">
              {title} 내역이 없습니다.
            </div>
          ) : (
            <ul className="mt-3 flex flex-col gap-y-3">
              {list.map(({ item, status }, idx) => {
                const { canRefund, canPartialRefund } = resolveRowRefund(item);
                return (
                  <PurchaseHistoryRow
                    key={`${item.applicationId ?? 'm'}-${item.membershipApplicationId ?? idx}`}
                    item={item}
                    status={status}
                    refund={
                      canRefund
                        ? {
                            canPartialRefund,
                            onRefund: (mode) =>
                              setRefundRequest({
                                target: buildRefundTarget(item, {
                                  name: data.userInfo.name,
                                  email: data.userInfo.email,
                                  phoneNum: data.userInfo.phoneNum,
                                }),
                                mode,
                              }),
                          }
                        : undefined
                    }
                    onRevoke={
                      canRevokeMembership(item)
                        ? () => setRevokeTarget(item)
                        : undefined
                    }
                  />
                );
              })}
            </ul>
          )}
        </section>
      ))}
      {revokeTarget && (
        <MembershipRevokeDialog
          programTitle={revokeTarget.programTitle ?? '올인원패스'}
          isSubmitting={revokeMutation.isPending}
          onConfirm={handleRevoke}
          onClose={() => setRevokeTarget(null)}
        />
      )}
      {refundRequest && (
        <RefundModal
          target={refundRequest.target}
          mode={refundRequest.mode}
          isSubmitting={refundMutation.isPending}
          onSubmit={(body) =>
            refundMutation.mutate({
              applicationId: refundRequest.target.applicationId,
              body,
            })
          }
          onClose={() => setRefundRequest(null)}
        />
      )}
    </div>
  );
};

export default PurchaseHistorySection;
