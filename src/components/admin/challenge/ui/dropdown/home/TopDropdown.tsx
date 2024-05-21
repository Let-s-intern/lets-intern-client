import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowDropdown } from 'react-icons/io';

import clsx from 'clsx';

interface Props {
  currentChallenge: any;
  setCurrentChallenge: (currentChallenge: any) => void;
  challengeList: any;
}

const TopDropdown = ({
  currentChallenge,
  setCurrentChallenge,
  challengeList,
}: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isMenuShown, setIsMenuShown] = useState(false);

  const isLoading = !challengeList || !currentChallenge;

  const handleMenuItemClick = (challengeId: number) => {
    localStorage.setItem('admin-challenge-id', `${challengeId}`);
    navigate(`/admin/challenge/${challengeId}`);
    queryClient.invalidateQueries({
      queryKey: ['program', 'admin', { type: 'CHALLENGE' }, 'admin_layout'],
    });
    setCurrentChallenge(
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
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex w-28 cursor-pointer items-center justify-between gap-4 rounded-xxs border border-neutral-400 py-2 pl-4 pr-2"
        onClick={() => setIsMenuShown(!isMenuShown)}
      >
        <span
          className={clsx('font-medium', {
            'opacity-0': isLoading,
          })}
        >
          {isLoading ? '00기' : `${currentChallenge.th}기`}
        </span>
        <i className="text-xl">
          <IoMdArrowDropdown />
        </i>
      </div>
      {!isLoading && isMenuShown && (
        <ul className="rounded absolute bottom-0 w-24 translate-y-[calc(100%+0.25rem)] bg-white shadow-md">
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
