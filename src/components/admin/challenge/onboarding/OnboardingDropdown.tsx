import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

import axios from '../../../../utils/axios';

interface Props {
  className?: string;
  selectedChallenge?: any;
  setSelectedChallenge: (selectedChallenge: any) => void;
}

const OnboardingDropdown = ({
  className,
  selectedChallenge,
  setSelectedChallenge,
}: Props) => {
  const [isMenuShown, setIsMenuShown] = useState(false);
  const [challengeList, setChallengeList] = useState<any>();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const getProgramList = useQuery({
    queryKey: ['program', 'admin', { type: 'CHALLENGE' }, 'onboarding'],
    queryFn: async () => {
      const res = await axios.get('/program/admin', {
        params: { type: 'CHALLENGE' },
      });
      const data = res.data;
      setChallengeList(
        data.programList
          .filter((challenge: any) => challenge.th !== 0)
          .sort((a: any, b: any) => b.th - a.th),
      );
      return data;
    },
  });

  const isLoading = getProgramList.isLoading || !challengeList;

  const handleMenuItemClick = async (challengeId: number) => {
    setSelectedChallenge(
      challengeList.find((challenge: any) => challenge.id === challengeId),
    );
    setIsMenuShown(false);
  };

  useEffect(() => {
    if (isMenuShown) {
      const handleClick = (e: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target as Node)
        ) {
          setIsMenuShown(false);
        }
      };
      document.addEventListener('click', handleClick);
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }
  }, [isMenuShown]);

  return (
    <div className={clsx('relative', className)} ref={dropdownRef}>
      <div
        className="flex w-24 cursor-pointer items-center justify-between gap-4 rounded border border-neutral-400 py-2 pl-4 pr-2"
        onClick={() => setIsMenuShown(!isMenuShown)}
      >
        <span
          className={clsx('font-medium', {
            'opacity-0': isLoading,
          })}
        >
          {selectedChallenge ? `${selectedChallenge.th}기` : '선택'}
        </span>
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

export default OnboardingDropdown;
