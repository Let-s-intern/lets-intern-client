import { useQuery } from '@tanstack/react-query';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
import { useCurrentChallenge } from '../../../../context/CurrentChallengeProvider';
import { getChallenge } from '../../../../schema';
import axios from '../../../../utils/axios';

const ChallengeAdminLayout = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['admin', 'challenge'],
    queryFn: async () => {
      const res = await axios.get(`/challenge?size=1000`);
      return res.data.data as z.infer<typeof getChallenge>;
    },
  });

  const { currentChallenge } = useCurrentChallenge();

  const navLinks = [
    {
      to: `/admin/challenge/operation/${params.programId}/home`,
      text: '홈',
    },
    {
      to: `/admin/challenge/operation/${params.programId}/register-mission`,
      text: '미션등록',
    },
    {
      to: `/admin/challenge/operation/${params.programId}/submission`,
      text: '제출확인',
    },
    {
      to: `/admin/challenge/operation/${params.programId}/participants`,
      text: '참여자',
    },
    {
      to: `/admin/challenge/operation/${params.programId}/payback`,
      text: '페이백',
    },
  ];

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
          <option value="">챌린지 변경</option>
          {data?.programList.map((program) => (
            <option value={program.id}>{program.title}</option>
          ))}
        </select>
      </div>
      <nav id="sidebar" className="flex">
        {navLinks.map((navLink) => (
          <NavLink
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
