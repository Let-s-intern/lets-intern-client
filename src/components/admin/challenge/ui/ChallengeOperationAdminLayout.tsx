import { twMerge } from '@/lib/twMerge';
import { useQuery } from '@tanstack/react-query';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useAdminCurrentChallenge } from '../../../../context/CurrentAdminChallengeProvider';
import { challenges } from '../../../../schema';
import axios from '../../../../utils/axios';

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
  ];
};

const ChallengeAdminLayout = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ['admin', 'challenge'],
    queryFn: async () => {
      const res = await axios.get(`/challenge?size=1000`);
      return res.data.data as z.infer<typeof challenges>;
    },
  });

  const { currentChallenge } = useAdminCurrentChallenge();

  const navLinks = getNavLinks(params.programId);

  return (
    <div className="p-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">
          챌린지 운영: {currentChallenge?.title}
        </h1>
        <select
          className="border p-3"
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
      <nav id="sidebar" className="flex">
        {navLinks.map((navLink) => (
          <NavLink
            key={navLink.to}
            to={navLink.to}
            className={({ isActive, isPending, isTransitioning }) =>
              twMerge('block px-4 py-2', isActive && 'text-blue-600')
            }
          >
            {navLink.text}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
};

export default ChallengeAdminLayout;
