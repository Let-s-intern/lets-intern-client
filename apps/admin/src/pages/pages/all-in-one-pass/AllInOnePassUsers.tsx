import { useGetParticipantsQuery } from '@/api/all-in-one-pass/useParticipants';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { PassParticipant } from '@/domain/all-in-one-pass/types';
import DownloadActions from '@/domain/all-in-one-pass/ui/participant/DownloadActions';
import ParticipantTable from '@/domain/all-in-one-pass/ui/participant/ParticipantTable';
import UsedProgramsModal from '@/domain/all-in-one-pass/ui/participant/UsedProgramsModal';
import { useMemo, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';

/**
 * 올인원패스 참여자 조회 (참여자 목록 + 이용 프로그램 조회).
 */
export default function AllInOnePassUsers() {
  const { passId } = useParams();
  const numericPassId = passId ? Number(passId) : undefined;

  const { data, isLoading, error } = useGetParticipantsQuery(numericPassId);
  const passTitle = data?.membershipTitle || '올인원패스';
  const participants = useMemo(() => data?.participants ?? [], [data]);

  const [usedProgramsOf, setUsedProgramsOf] = useState<PassParticipant | null>(
    null,
  );

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
