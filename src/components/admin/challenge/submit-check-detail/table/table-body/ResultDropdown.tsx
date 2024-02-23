import clsx from 'clsx';
import { useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

import { challengeSubmitDetailCellWidthList } from '../../../../../../utils/tableCellWidthList';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../../../../../utils/axios';
import { attendanceResultToText } from '../../../../../../utils/convert';

interface Props {
  attendance: any;
  attendanceResult: string;
  setAttendanceResult: (attendanceResult: string) => void;
  cellWidthListIndex: number;
}

const ResultDropdown = ({
  attendance,
  attendanceResult,
  setAttendanceResult,
  cellWidthListIndex,
}: Props) => {
  const queryClient = useQueryClient();

  const [isMenuShown, setIsMenuShown] = useState(false);

  const cellWidthList = challengeSubmitDetailCellWidthList;

  const editAttendanceStatus = useMutation({
    mutationFn: async (result: string) => {
      const res = await axios.patch(`/attendance/admin/${attendance.id}`, {
        result,
      });
      const data = res.data;
      return data;
    },
    onSuccess: async (_, result: string) => {
      setIsMenuShown(false);
      setAttendanceResult(result);
    },
  });

  return (
    <div
      className={clsx(
        'relative flex items-center justify-center text-ellipsis border-r border-[#D9D9D9] text-center text-sm',
        cellWidthList[cellWidthListIndex],
      )}
      onClick={(e) => e.preventDefault()}
    >
      {attendance && (
        <div
          className="cursor-pointer rounded-md border border-gray-400 py-1 pl-2 pr-1 text-xs"
          onClick={() => setIsMenuShown(!isMenuShown)}
        >
          <div className="flex items-center gap-1">
            <span>{attendanceResultToText[attendanceResult]}</span>
            <i>
              <IoMdArrowDropdown />
            </i>
          </div>
        </div>
      )}
      {isMenuShown && attendance && (
        <ul className="absolute bottom-0 z-50 w-full translate-y-[100%] rounded-lg border border-[#E5E5E5] bg-white">
          {Object.keys(attendanceResultToText).map(
            (result: any, index: number) => (
              <li
                key={index}
                className="cursor-pointer border-b border-[#E5E5E5] px-3 py-2 text-xs"
                onClick={() => editAttendanceStatus.mutate(result)}
              >
                {attendanceResultToText[result]}
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
};

export default ResultDropdown;
