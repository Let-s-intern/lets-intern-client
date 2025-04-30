import { useMissionsOfCurrentChallengeRefetch } from '@/context/CurrentAdminChallengeProvider';
import { AttendanceItem } from '@/schema';
import axios from '@/utils/axios';
import { attendanceResultToText } from '@/utils/convert';
import { challengeSubmitDetailCellWidthList } from '@/utils/tableCellWidthList';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

interface Props {
  attendance: AttendanceItem['attendance'];
  attendanceResult: AttendanceItem['attendance']['result'];
  setAttendanceResult: (
    attendanceResult: AttendanceItem['attendance']['result'],
  ) => void;
  cellWidthListIndex: number;
  setIsRefunded: (isRefunded: boolean) => void;
}

// export const attendanceResultToText: any = {
//   WAITING: '확인중',
//   PASS: '확인 완료',
//   WRONG: '반려',
// };

const getAttendanceResultText = (
  result: AttendanceItem['attendance']['result'],
) => {
  switch (result) {
    case 'WAITING':
      return '확인중';
    case 'PASS':
      return '확인 완료';
    case 'WRONG':
      return '반려';
  }

  return '';
};

const ResultDropdown = ({
  attendance,
  attendanceResult,
  setAttendanceResult,
  cellWidthListIndex,
  setIsRefunded,
}: Props) => {
  const queryClient = useQueryClient();
  const [isMenuShown, setIsMenuShown] = useState(false);
  const missionRefetch = useMissionsOfCurrentChallengeRefetch();

  const cellWidthList = challengeSubmitDetailCellWidthList;

  const editAttendanceStatus = useMutation({
    mutationFn: async (result: AttendanceItem['attendance']['result']) => {
      const res = await axios.patch(`/attendance/${attendance.id}`, {
        result,
        // isRefunded:
        //   result === 'PASS' && attendanceResult !== 'PASS' ? false : true,
      });
      const data = res.data;
      return data;
    },
    onSuccess: async (_, result: AttendanceItem['attendance']['result']) => {
      setIsMenuShown(false);
      setIsRefunded(
        result === 'PASS' && attendanceResult !== 'PASS' ? false : true,
      );
      setAttendanceResult(result);
      missionRefetch();
      queryClient.invalidateQueries({
        queryKey: ['admin'],
      });
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
          className="cursor-pointer rounded-sm border border-gray-400 py-1 pl-2 pr-1 text-xs"
          onClick={() => setIsMenuShown(!isMenuShown)}
        >
          <div className="flex items-center gap-1">
            <span>{getAttendanceResultText(attendanceResult)}</span>
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
