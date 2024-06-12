import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

import axios from '../../../../utils/axios';
import { IProgram } from '../../../../interfaces/Program.interface';
import dayjs from 'dayjs';

interface Props {
  className?: string;
  selectedChallenge?: IProgram | null;
  setSelectedChallenge: (selectedChallenge: IProgram | null) => void;
}

const OnboardingDropdown = ({
  className,
  selectedChallenge,
  setSelectedChallenge,
}: Props) => {
  const [isMenuShown, setIsMenuShown] = useState(false);
  const [challengeList, setChallengeList] = useState<IProgram[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const getProgramList = useQuery({
    queryKey: ['program', 'admin', { type: 'CHALLENGE' }, 'onboarding'],
    queryFn: async () => {
      const res = await axios.get('/program/admin', {
        params: { type: 'CHALLENGE' },
      });
      const data = res.data.data as {programList: IProgram[]};
      console.log("data", data);
      const list = [...data.programList];
      list.sort((a, b) => {
        return dayjs(a.programInfo.beginning).diff(dayjs(b.programInfo.beginning));
      });
      setChallengeList(list
      );
      return data;
    },
  });

  const isLoading = getProgramList.isLoading || !challengeList;

  const handleMenuItemClick = async (program: IProgram) => {
    setSelectedChallenge(program);
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

  useEffect(() => {
    console.log("challengeList", challengeList);
  }, [challengeList]);

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
          {selectedChallenge ? `${selectedChallenge.programInfo.title}` : '선택'}
        </span>
        <i className="text-xl">
          <IoMdArrowDropdown />
        </i>
      </div>
      {!isLoading && isMenuShown && (
        <ul className="absolute bottom-0 w-64 translate-y-[calc(100%+0.25rem)] rounded bg-white shadow-md">
          {challengeList.map((challenge, index) => (
            <li
              // key={challenge.programInfo.id}
              key={index}
              className="cursor-pointer py-3 pl-4 pr-2 font-medium hover:bg-gray-50"
              onClick={() => handleMenuItemClick(challenge)}
            >
              {challenge.programInfo.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OnboardingDropdown;
