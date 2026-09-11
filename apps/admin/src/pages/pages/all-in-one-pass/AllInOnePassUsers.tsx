import { useGetAllInOnePassListQuery } from '@/api/all-in-one-pass/usePassList';
import {
  passParticipantListQueryKey,
  useGetPassParticipantsQuery,
  useRefundPassParticipantMutation,
} from '@/api/all-in-one-pass/useParticipants';
import { AdminRefundRequest } from '@/api/adminRefund';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import ParticipantTable from '@/domain/all-in-one-pass/ui/participant/ParticipantTable';
import UsedProgramsModal from '@/domain/all-in-one-pass/ui/participant/UsedProgramsModal';
import { PassParticipant } from '@/domain/all-in-one-pass/types';
import RefundModal, {
  RefundMode,
  RefundTarget,
} from '@/domain/admin/program/program-user/ui/RefundModal';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { useQueryClient } from '@tanstack/react-query';
import { IoArrowBack } from 'react-icons/io5';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

/** 올인원패스 참여자 조회 (기존 참여자 레이아웃 + 환불 + 이용 프로그램 조회) */
export default function AllInOnePassUsers() {
  const { passId } = useParams();
  const numericPassId = passId ? Number(passId) : undefined;
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  const { data: passes } = useGetAllInOnePassListQuery();
  const passTitle = useMemo(
    () => passes?.find((p) => p.id === numericPassId)?.title ?? '올인원패스',
    [passes, numericPassId],
  );

  const { data, isLoading, error } = useGetPassParticipantsQuery(numericPassId);
  const participants = useMemo(() => data ?? [], [data]);

  const [refundRequest, setRefundRequest] = useState<{
    target: RefundTarget;
    mode: RefundMode;
  } | null>(null);
  const [usedProgramsOf, setUsedProgramsOf] = useState<PassParticipant | null>(
    null,
  );

  const refundMutation = useRefundPassParticipantMutation({
    successCallback: () => {
      queryClient.invalidateQueries({
        queryKey: [passParticipantListQueryKey],
      });
      snackbar('환불 처리되었습니다.');
      setRefundRequest(null);
    },
    errorCallback: (e) =>
      snackbar(e instanceof Error ? e.message : '환불에 실패했습니다.'),
  });

  const handleRefundSubmit = (body: AdminRefundRequest) => {
    if (!refundRequest) return;
    refundMutation.mutate({
      applicationId: refundRequest.target.applicationId,
      body,
    });
  };

  return (
    <main className="flex flex-col gap-5 p-6">
      <div className="flex flex-col gap-2">
        <Link
          to="/all-in-one-pass"
          className="flex w-fit items-center gap-1 text-xsmall14 text-neutral-40 hover:text-neutral-0"
        >
          <IoArrowBack />
          올인원패스 개설
        </Link>
        <Header>
          <Heading>{passTitle} 참여자</Heading>
        </Header>
      </div>

      {isLoading ? (
        <LoadingContainer />
      ) : error ? (
        <div className="py-4 text-center">에러 발생</div>
      ) : participants.length === 0 ? (
        <EmptyContainer text="참여자가 없습니다." />
      ) : (
        <ParticipantTable
          participants={participants}
          programTitle={passTitle}
          onRefundClick={(target, mode) => setRefundRequest({ target, mode })}
          onUsedProgramsClick={setUsedProgramsOf}
        />
      )}

      {refundRequest && (
        <RefundModal
          target={refundRequest.target}
          mode={refundRequest.mode}
          isSubmitting={refundMutation.isPending}
          onSubmit={handleRefundSubmit}
          onClose={() => setRefundRequest(null)}
        />
      )}

      <UsedProgramsModal
        participant={usedProgramsOf}
        onClose={() => setUsedProgramsOf(null)}
      />
    </main>
  );
}
