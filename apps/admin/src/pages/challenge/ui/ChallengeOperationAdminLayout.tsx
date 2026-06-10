import {
  ChallengeList,
  getClickCopy,
  useGetChallengeList,
  usePostTestParticipation,
} from '@/api/challenge/challenge';
import { useIsAdminQuery } from '@/api/user/user';
import LoadingContainer from '@/common/loading/LoadingContainer';
import BaseModal from '@/common/modal/BaseModal';
import { useAdminCurrentChallenge } from '@/context/CurrentAdminChallengeProvider';
import Heading from '@/domain/admin/ui/heading/Heading';
import useMentorAccessControl from '@/hooks/useMentorAccessControl';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { Button, Checkbox } from '@mui/material';
import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

const WEB_URL = import.meta.env.VITE_WEB_URL ?? '';

const getNavLinks = (programId?: string | number) => {
  return [
    {
      id: 'home',
      to: `/challenge/operation/${programId}/home`,
      text: '홈',
    },
    {
      id: 'register-mission',
      to: `/challenge/operation/${programId}/register-mission`,
      text: '미션등록',
    },
    {
      id: 'attendances',
      to: `/challenge/operation/${programId}/attendances`,
      text: '제출확인',
    },
    {
      id: 'participants',
      to: `/challenge/operation/${programId}/participants`,
      text: '참여자',
    },
    {
      id: 'payback',
      to: `/challenge/operation/${programId}/payback`,
      text: '페이백',
    },
    {
      id: 'feedback',
      to: `/challenge/operation/${programId}/feedback`,
      text: '피드백',
    },
  ];
};

const Actions = ({ openModal }: { openModal: () => void }) => {
  const navigate = useNavigate();
  const params = useParams<{ programId: string }>();

  const { data } = useGetChallengeList({
    pageable: {
      size: 1000,
      page: 1,
    },
  });
  const { data: isAdmin } = useIsAdminQuery();
  const { currentChallenge } = useAdminCurrentChallenge();
  const isAfterStart = dayjs().isAfter(currentChallenge?.startDate, 'day');

  const [testDate, setTestDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [applicationId, setApplicationId] = useState<number | null>(null);

  const { mutate: postTestParticipation, isPending } =
    usePostTestParticipation();

  const handleTestParticipation = () => {
    if (!params.programId) return;
    postTestParticipation(params.programId, {
      onSuccess: (data) => {
        setApplicationId(data.applicationId);
        alert('테스트 참여자로 등록되었습니다.');
      },
      onError: () => {
        alert('테스트 참여 등록에 실패했습니다.');
      },
    });
  };

  const dashboardUrl = applicationId
    ? `${WEB_URL}/challenge/${applicationId}/${params.programId}?testDate=${testDate}`
    : null;

  if (!isAdmin) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="contained"
        onClick={handleTestParticipation}
        disabled={isPending}
      >
        테스트 참여
      </Button>
      {applicationId && (
        <>
          <input
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            className="border px-2 py-1 text-sm"
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => window.open(dashboardUrl!, '_blank')}
          >
            대시보드 접속
          </Button>
        </>
      )}
      {/* 아직 시작하지 않은 챌린지만 대시보드 복제 가능 */}
      <Button disabled={isAfterStart} variant="outlined" onClick={openModal}>
        대시보드 복제
      </Button>
      <select
        className="ml-3 border p-3"
        onChange={(e) => {
          if (e.target.value) {
            navigate(`/challenge/operation/${e.target.value}/home`);
          }
        }}
      >
        <option key="change" value="">
          챌린지 변경
        </option>
        {data?.programList.map((program) => (
          <option key={program.id} value={program.id}>
            {program.title}
          </option>
        ))}
      </select>
    </div>
  );
};

const Navigation = () => {
  const params = useParams<{ programId: string }>();
  const pathname = useLocation().pathname;
  const navLinks = getNavLinks(params.programId);

  const { data: isAdmin } = useIsAdminQuery();

  if (!isAdmin) return null;

  return (
    <nav id="sidebar" className="flex">
      {navLinks.map((navLink) => {
        const isActive = pathname === navLink.to;
        return (
          <Link
            key={navLink.to}
            to={navLink.to}
            className={twMerge('block px-4 py-2', isActive && 'text-blue-600')}
          >
            {navLink.text}
          </Link>
        );
      })}
    </nav>
  );
};

const ChallengeDashBoardModal = ({
  isOpen,
  onClose,
  challengeList,
}: {
  isOpen: boolean;
  challengeList: ChallengeList;
  onClose: () => void;
}) => {
  const { programId } = useParams();

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleClickCopy = async () => {
    const yes = confirm('복제하시겠습니까?');
    if (!yes) return;

    await getClickCopy(selectedId!, Number(programId));
    window.location.reload();
  };

  return (
    <BaseModal className="max-w-[800px]" isOpen={isOpen} onClose={onClose}>
      <section className="p-5">
        <p className="text-small18 mb-5 font-bold">
          대시보드를 복제할 챌린지를 선택해주세요
        </p>
        <ul className="flex h-[600px] flex-col gap-1 overflow-y-auto">
          {challengeList?.programList.map((challenge) => (
            <li
              key={challenge.id}
              className="w-fit cursor-pointer"
              onClick={() => {
                setSelectedId(challenge.id);
              }}
            >
              <Checkbox checked={selectedId === challenge.id} />
              <span>{`[${challenge.id}] ${challenge.title}`}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-end gap-3">
          <Button
            variant="contained"
            disabled={!selectedId || !programId}
            onClick={handleClickCopy}
          >
            대시보드 복제
          </Button>
          <Button variant="outlined" onClick={onClose}>
            취소
          </Button>
        </div>
      </section>
    </BaseModal>
  );
};

const ChallengeAdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { data } = useGetChallengeList({
    pageable: {
      size: 1000,
      page: 1,
    },
  });
  const { currentChallenge } = useAdminCurrentChallenge();
  const { data: isAdmin } = useIsAdminQuery();

  const isLoading = useMentorAccessControl();

  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) return <LoadingContainer className="mt-[20%]" />;

  return (
    <section className="p-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <Heading className="mb-4">
          챌린지 운영: {currentChallenge?.title}
        </Heading>
        <Actions openModal={() => setIsOpen(true)} />
      </div>

      <Navigation />
      {children}
      {/* 대시보드를 복제할 챌린지 리스트 */}
      {isAdmin && data && (
        <ChallengeDashBoardModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          challengeList={data}
        />
      )}
    </section>
  );
};

export default ChallengeAdminLayout;
