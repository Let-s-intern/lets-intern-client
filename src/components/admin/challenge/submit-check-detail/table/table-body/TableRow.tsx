import { usePatchChallengeAttendance } from '@/api/challenge';
import { useAdminCurrentChallenge } from '@/context/CurrentAdminChallengeProvider';
import { Switch } from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Attendance, Mission } from '../../../../../../schema';
import { challengeSubmitDetailCellWidthList } from '../../../../../../utils/tableCellWidthList';
import ChoiceCheckbox from './ChoiceCheckbox';
import CommentCell from './CommentCell';
import ResultDropdown from './ResultDropdown';
import ReviewCell from './ReviewCell';
import StatusDropdown from './StatusDropdown';

interface Props {
  attendance: Attendance;
  missionDetail?: Mission;
  th?: number;
  bgColor: 'DARK' | 'LIGHT';
  isChecked: boolean;
  setIsCheckedList: (isCheckedList: any) => void;
  refetch: () => void;
}

const TableRow = ({
  attendance,
  missionDetail,
  th,
  bgColor,
  isChecked,
  setIsCheckedList,
  refetch,
}: Props) => {
  const { currentChallenge } = useAdminCurrentChallenge();
  const [attendanceResult, setAttendanceResult] = useState(attendance.result);

  const { mutate: updateAttendance } = usePatchChallengeAttendance({
    errorCallback: (error) => {
      alert(error);
    },
  });

  const cellWidthList = challengeSubmitDetailCellWidthList;

  const handleToggle = () => {
    updateAttendance({
      attendanceId: attendance.id,
      challengeId: currentChallenge?.id,
      missionId: missionDetail?.id,
      reviewIsVisible: !attendance.reviewIsVisible,
    });
  };

  return (
    <div
      className={clsx('flex justify-between', {
        'bg-[#F1F1F1]': bgColor === 'DARK',
        'bg-[#F7F7F7]': bgColor === 'LIGHT',
      })}
    >
      <ChoiceCheckbox
        attendance={attendance}
        cellWidthListIndex={0}
        isChecked={isChecked}
        setIsCheckedList={setIsCheckedList}
      />
      {/* 제출일자 */}
      <div
        className={clsx(
          'my-auto overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center text-sm',
          cellWidthList[1],
        )}
      >
        {attendance?.createDate?.format('YYYY-MM-DD HH:mm')}
      </div>

      {/* 이름 */}
      <div
        className={clsx(
          'my-auto overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center text-sm',
          cellWidthList[2],
        )}
      >
        {attendance.name}
      </div>

      {/* 메일 */}
      <div
        className={clsx(
          'my-auto overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center text-sm',
          cellWidthList[3],
        )}
      >
        {attendance.email}
      </div>
      {/* 제출현황 */}
      <StatusDropdown
        attendance={attendance}
        cellWidthListIndex={4}
        refetch={refetch}
      />

      {/* 미션 */}
      <div
        className={clsx(
          'my-auto overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center text-sm',
          cellWidthList[5],
        )}
      >
        {attendance.link && (
          <Link
            to={attendance.link}
            target="_blank"
            rel="noopenner noreferrer"
            className="rounded-xxs border border-zinc-600 px-4 py-[2px] text-xs duration-200 hover:bg-neutral-700 hover:text-white"
          >
            확인
          </Link>
        )}
      </div>

      {/* 확인여부 */}
      <ResultDropdown
        attendance={attendance}
        attendanceResult={attendanceResult}
        setAttendanceResult={setAttendanceResult}
        setIsRefunded={() => {}}
        cellWidthListIndex={6}
      />
      <CommentCell attendance={attendance} cellWidthListIndex={7} />
      <ReviewCell
        review={attendance.review ?? undefined}
        cellWidthListIndex={8}
      />
      <div
        className={clsx(
          'overflow-hidden text-ellipsis py-3 text-center text-sm',
          cellWidthList[9],
        )}
      >
        <Switch
          checked={attendance.reviewIsVisible ?? false}
          onChange={handleToggle}
        />
      </div>
    </div>
  );
};

export default TableRow;
