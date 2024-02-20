import clsx from 'clsx';
import { useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import axios from '../../../../../../utils/axios';
import { missionStatusToText } from '../../../../../../utils/convert';

interface Props {
  mission: any;
}

const StatusDropdown = ({ mission }: Props) => {
  const queryClient = useQueryClient();

  const [isMenuShown, setIsMenuShown] = useState(false);

  const editMissionStatus = useMutation({
    mutationFn: async (status) => {
      const res = await axios.patch(`/mission/${mission.id}`, { status });
      const data = res.data;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['mission'],
      });
      setIsMenuShown(false);
    },
  });

  return (
    <div
      className="relative flex w-full items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="w-20 cursor-pointer rounded-md border border-gray-400 px-2 py-1 text-xs"
        onClick={(e) => setIsMenuShown(!isMenuShown)}
      >
        <div className="flex items-center justify-between gap-1">
          <span>{missionStatusToText[mission.status]}</span>
          <i>
            <IoMdArrowDropdown />
          </i>
        </div>
      </div>
      {isMenuShown && (
        <ul className="absolute bottom-0 z-50 w-20 translate-y-[100%] rounded-lg border border-[#E5E5E5] bg-white">
          {Object.keys(missionStatusToText).map(
            (status: any, index: number) => (
              <li
                key={index}
                className={clsx('cursor-pointer px-3 py-2 text-xs', {
                  'border-b border-[#E5E5E5]':
                    index !== Object.keys(missionStatusToText).length - 1,
                })}
                onClick={async () => editMissionStatus.mutate(status)}
              >
                {missionStatusToText[status]}
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
};

export default StatusDropdown;
