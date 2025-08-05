import { useMissionsOfCurrentChallengeRefetch } from '@/context/CurrentAdminChallengeProvider';
import { AttendanceItem } from '@/schema';
import axiosV2 from '@/utils/axiosV2';
import { attendanceStatusToText } from '@/utils/convert';
import { challengeSubmitDetailCellWidthList } from '@/utils/tableCellWidthList';
import AlertModal from '@components/ui/alert/AlertModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

interface Props {
  attendance: AttendanceItem['attendance'];
  cellWidthListIndex: number;
  refetch: () => void;
}

const StatusDropdown = ({ attendance, cellWidthListIndex, refetch }: Props) => {
  const queryClient = useQueryClient();

  const [isMenuShown, setIsMenuShown] = useState(false);
  const [isModalShown, setIsModalShown] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const cellWidthList = challengeSubmitDetailCellWidthList;
  const missionRefetch = useMissionsOfCurrentChallengeRefetch();

  const editAttendanceStatus = useMutation({
    mutationFn: async (status: string) => {
      const res = await axiosV2.patch(`/admin/attendance/${attendance.id}`, {
        status,
      });
      const data = res.data;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['admin'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['challenge'],
      });
      refetch();
      missionRefetch();
      setIsMenuShown(false);
      setIsModalShown(false);
    },
  });

  return (
    <>
      <div
        className={clsx(
          'relative flex items-center justify-center text-ellipsis border-r border-[#D9D9D9] text-center text-sm',
          cellWidthList[cellWidthListIndex],
        )}
      >
        {attendance && (
          <div
            className="cursor-pointer rounded-sm border border-gray-400 py-1 pl-2 pr-1 text-xs"
            onClick={() => setIsMenuShown(!isMenuShown)}
          >
            <div className="flex items-center gap-1">
              <span>
                {attendance.status && attendanceStatusToText[attendance.status]}
              </span>
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
                  onClick={async () => {
                    setNewStatus(status);
                    setIsModalShown(true);
                  }}
                >
                  {attendanceStatusToText[status]}
                </li>
              ),
            )}
          </ul>
        )}
      </div>
      {isModalShown && (
        <AlertModal
          onConfirm={() => editAttendanceStatus.mutate(newStatus)}
          onCancel={() => {
            setIsMenuShown(false);
            setIsModalShown(false);
          }}
          title="제출현황 변경"
        >
          제출현황을 정말로 변경하시겠습니까?
        </AlertModal>
      )}
    </>
  );
};

export default StatusDropdown;
