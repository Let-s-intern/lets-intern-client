import { useGetParticipantsQuery } from '@/api/all-in-one-pass/useParticipants';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { PassParticipant } from '@/domain/all-in-one-pass/types';
import DownloadActions from '@/domain/all-in-one-pass/ui/participant/DownloadActions';
import ParticipantTable from '@/domain/all-in-one-pass/ui/participant/ParticipantTable';
import UsedProgramsModal from '@/domain/all-in-one-pass/ui/participant/UsedProgramsModal';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { useMemo, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';

/**
 * 올인원패스 참여자 조회 (참여자 목록 + 이용 프로그램 조회 + 권한 회수).
 * 환불은 멤버십 전용 환불 API 미구현이라 토스페이먼츠에서 직접 처리한다.
 */
export default function AllInOnePassUsers() {
  const { passId } = useParams();
  const numericPassId = passId ? Number(passId) : undefined;
  const { snackbar } = useAdminSnackbar();

  const { data, isLoading, error } = useGetParticipantsQuery(numericPassId);
  const passTitle = data?.membershipTitle || '올인원패스';
  const participants = useMemo(() => data?.participants ?? [], [data]);

  const [usedProgramsOf, setUsedProgramsOf] = useState<PassParticipant | null>(
    null,
  );

  // TODO: 권한 회수 API 연동 (BE 개발 후)
  const handleRevoke = (participant: PassParticipant) => {
    if (!window.confirm(`<${participant.name}>님의 권한을 회수하시겠습니까?`))
      return;
    snackbar('권한 회수 API 연동 예정입니다.');
  };

  return (
    <main className="flex flex-col gap-5 p-6">
      <div className="flex flex-col gap-2">
        <Link
          to="/all-in-one-pass"
          className="text-xsmall14 text-neutral-40 hover:text-neutral-0 flex w-fit items-center gap-1"
        >
          <IoArrowBack />
          올인원패스 개설
        </Link>
        <Header>
          <Heading>{passTitle} 참여자</Heading>
          {participants.length > 0 && (
            <DownloadActions
              participants={participants}
              programTitle={passTitle}
            />
          )}
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
          onRevokeClick={handleRevoke}
          onUsedProgramsClick={setUsedProgramsOf}
        />
      )}

      <UsedProgramsModal
        participant={usedProgramsOf}
        passId={numericPassId}
        onClose={() => setUsedProgramsOf(null)}
      />
    </main>
  );
}
