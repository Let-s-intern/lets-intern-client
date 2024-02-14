import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdArrowDropdown } from 'react-icons/io';

import axios from '../../../../../../utils/axios';

const TopDropdown = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [isMenuShown, setIsMenuShown] = useState(false);
  const [challengeList, setChallengeList] = useState<any>();
  const [currentChallenge, setCurrentChallenge] = useState<any>();

  const getProgramList = useQuery({
    queryKey: ['program', 'admin', params.programId],
    queryFn: async () => {
      const res = await axios.get('/program/admin');
      const data = res.data;
      const newChallengeList = data.programList.filter((program: any) => {
        if (
          program.type === 'CHALLENGE_FULL' ||
          program.type === 'CHALLENGE_HALF'
        ) {
          if (program.id === Number(params.programId)) {
            setCurrentChallenge(program);
          }
          return true;
        }
      });
      setChallengeList(newChallengeList);
      return data;
    },
  });

  const isLoading =
    getProgramList.isLoading || !challengeList || !currentChallenge;

  const handleMenuItemClick = async (challengeId: number) => {
    navigate(`/admin/challenge/${challengeId}`);
    setIsMenuShown(false);
  };

  return (
    <div className="relative">
      <div
        className="flex w-24 cursor-pointer items-center justify-between gap-4 rounded border border-neutral-400 py-2 pl-4 pr-2"
        onClick={() => setIsMenuShown(!isMenuShown)}
      >
        {!currentChallenge ? (
          <span className="font-medium opacity-0">없음</span>
        ) : (
          <span className="font-medium">{currentChallenge.th}기</span>
        )}
        <i className="text-xl">
          <IoMdArrowDropdown />
        </i>
      </div>
      {!isLoading && isMenuShown && (
        <ul className="absolute bottom-0 w-24 translate-y-[calc(100%+0.25rem)] rounded bg-white shadow-md">
          {challengeList.map((challenge: any) => (
            <li
              key={challenge.id}
              className="cursor-pointer py-3 pl-4 pr-2 font-medium hover:bg-gray-50"
              onClick={() => handleMenuItemClick(challenge.id)}
            >
              {challenge.th}기
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopDropdown;
