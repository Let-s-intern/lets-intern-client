import { useMissionsOfCurrentChallengeRefetch } from '@/context/CurrentAdminChallengeProvider';
import { AttendanceItem } from '@/schema';
import axiosV2 from '@/utils/axiosV2';
import { attendanceResultToText } from '@/utils/convert';
import { challengeSubmitDetailCellWidthList } from '@/utils/tableCellWidthList';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

interface Props {
  attendance: AttendanceItem['attendance'];
  cellWidthListIndex: number;
  setIsRefunded: (isRefunded: boolean) => void;
}

const ResultDropdown = ({
  attendance,
  cellWidthListIndex,
  setIsRefunded,
}: Props) => {
  const queryClient = useQueryClient();
  const [isMenuShown, setIsMenuShown] = useState(false);
  const missionRefetch = useMissionsOfCurrentChallengeRefetch();

  const cellWidthList = challengeSubmitDetailCellWidthList;

  const editAttendanceStatus = useMutation({
    mutationFn: async (result: AttendanceItem['attendance']['result']) => {
      const res = await axiosV2.patch(`/admin/attendance/${attendance.id}`, {
        result,
      });
      const data = res.data;
      return data;
    },
    onSuccess: async (_, result: AttendanceItem['attendance']['result']) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin'] }),
        queryClient.invalidateQueries({ queryKey: ['challenge'] }),
        missionRefetch(),
      ]);
      setIsMenuShown(false);
      setIsRefunded(
        result === 'PASS' && attendance.result !== 'PASS' ? false : true,
      );
    },
  });

  return (
    <div
      className={clsx(
        'relative flex items-center justify-center text-ellipsis border-r border-[#D9D9D9] px-2 py-3 text-center text-sm',
        cellWidthList[cellWidthListIndex],
      )}
      onClick={(e) => e.preventDefault()}
    >
      {attendance?.isCanceled ? (
        // 취소(환불)한 신청은 확인여부를 바꿀 수 없다.
        // 테두리를 두면 버튼처럼 보여 눌러도 되는 줄 알게 되므로 글자만 둔다.
        // 나머지 칸은 흐리게 두되 이 글자만 빨갛게 남겨 왜 잠겼는지 바로 보이게 한다.
        <span className="text-xs font-medium text-red-500">취소/환불</span>
      ) : (
        attendance && (
          <div
            className="cursor-pointer rounded-sm border border-gray-400 py-1 pl-2 pr-1 text-xs"
            onClick={() => setIsMenuShown(!isMenuShown)}
          >
            <div className="flex items-center gap-1">
              <span>
                {attendance.result && attendanceResultToText[attendance.result]}
              </span>
              <i>
                <IoMdArrowDropdown />
              </i>
            </div>
          </div>
        )
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
