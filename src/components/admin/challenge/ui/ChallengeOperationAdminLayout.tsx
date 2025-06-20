import {
  ChallengeList,
  getClickCopy,
  useGetChallengeList,
} from '@/api/challenge';
import { useIsAdminQuery } from '@/api/user';
import { useAdminCurrentChallenge } from '@/context/CurrentAdminChallengeProvider';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import Heading from '@components/admin/ui/heading/Heading';
import BaseModal from '@components/ui/BaseModal';
import { Button, Checkbox } from '@mui/material';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';

const getNavLinks = (programId?: string | number) => {
  return [
    {
      id: 'home',
      to: `/admin/challenge/operation/${programId}/home`,
      text: '홈',
    },
    {
      id: 'register-mission',
      to: `/admin/challenge/operation/${programId}/register-mission`,
      text: '미션등록',
    },
    {
      id: 'attendances',
      to: `/admin/challenge/operation/${programId}/attendances`,
      text: '제출확인',
    },
    {
      id: 'participants',
      to: `/admin/challenge/operation/${programId}/participants`,
      text: '참여자',
    },
    {
      id: 'payback',
      to: `/admin/challenge/operation/${programId}/payback`,
      text: '페이백',
    },
    {
      id: 'feedback',
      to: `/admin/challenge/operation/${programId}/feedback`,
      text: '피드백',
    },
  ];
};

const ChallengeAdminLayout = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data } = useGetChallengeList({
    pageable: {
      size: 1000,
      page: 1,
    },
  });
  const { currentChallenge } = useAdminCurrentChallenge();
  const { data: isAdmin } = useIsAdminQuery();

  const isAfterStart = dayjs().isAfter(currentChallenge?.startDate, 'day');
  const navLinks = getNavLinks(params.programId);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="p-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <Heading className="mb-4">
          챌린지 운영: {currentChallenge?.title}
        </Heading>

        {isAdmin && (
          <div>
            {/* 아직 시작하지 않은 챌린지만 대시보드 복제 가능 */}
            <Button
              disabled={isAfterStart}
              variant="outlined"
              onClick={() => setIsOpen(true)}
            >
              대시보드 복제
            </Button>
            <select
              className="ml-3 border p-3"
              onChange={(e) => {
                if (e.target.value) {
                  navigate(`/admin/challenge/operation/${e.target.value}/home`);
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
        )}
      </div>

      {/* 네비게이션 */}
      {isAdmin && (
        <nav id="sidebar" className="flex">
          {navLinks.map((navLink) => (
            <NavLink
              key={navLink.to}
              to={navLink.to}
              className={({ isActive }) =>
                twMerge('block px-4 py-2', isActive && 'text-blue-600')
              }
            >
              {navLink.text}
            </NavLink>
          ))}
        </nav>
      )}

      <Outlet />

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

function ChallengeDashBoardModal({
  isOpen,
  onClose,
  challengeList,
}: {
  isOpen: boolean;
  challengeList: ChallengeList;
  onClose: () => void;
}) {
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
        <p className="mb-5 text-small18 font-bold">
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
}

export default ChallengeAdminLayout;
