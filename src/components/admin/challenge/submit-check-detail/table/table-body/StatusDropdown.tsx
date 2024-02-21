import clsx from 'clsx';
import { useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

import { challengeSubmitDetailCellWidthList } from '../../../../../../utils/tableCellWidthList';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../../../../../utils/axios';
import { attendanceStatusToText } from '../../../../../../utils/convert';

interface Props {
  attendance: any;
  cellWidthListIndex: number;
}

const StatusDropdown = ({ attendance, cellWidthListIndex }: Props) => {
  const queryClient = useQueryClient();

  const [isMenuShown, setIsMenuShown] = useState(false);

  const cellWidthList = challengeSubmitDetailCellWidthList;

  const editAttendanceStatus = useMutation({
    mutationFn: async (status) => {
      const res = await axios.patch(`/attendance/admin/${attendance.id}`, {
        status,
      });
      const data = res.data;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['attendance'],
      });
      setIsMenuShown(false);
    },
  });

  return (
    <div
      className={clsx(
        'relative flex items-center justify-center text-ellipsis border-r border-[#D9D9D9] text-center text-sm',
        cellWidthList[cellWidthListIndex],
      )}
    >
      {attendance && (
        <div
          className="cursor-pointer rounded-md border border-gray-400 py-1 pl-2 pr-1 text-xs"
          onClick={() => setIsMenuShown(!isMenuShown)}
        >
          <div className="flex items-center gap-1">
            <span>{attendanceStatusToText[attendance.status]}</span>
            <i>
              <IoMdArrowDropdown />
            </i>
          </div>
        </div>
      )}
      {isMenuShown && attendance && (
        <ul className="absolute bottom-0 z-50 w-full translate-y-[100%] rounded-lg border border-[#E5E5E5] bg-white">
          {Object.keys(attendanceStatusToText).map(
            (status: any, index: number) => (
              <li
                key={index}
                className={clsx('cursor-pointer px-3 py-2 text-xs', {
                  'border-b border-[#E5E5E5]':
                    index !== Object.keys(attendanceStatusToText).length - 1,
                })}
                onClick={async () => editAttendanceStatus.mutate(status)}
              >
                {attendanceStatusToText[status]}
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
};

export default StatusDropdown;
