import { usePatchChallengeAttendance } from '@/api/challenge';
import { useAdminCurrentChallenge } from '@/context/CurrentAdminChallengeProvider';
import { AttendanceItem, Mission } from '@/schema';
import { challengeSubmitDetailCellWidthList } from '@/utils/tableCellWidthList';
import { Switch } from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ChoiceCheckbox from './ChoiceCheckbox';
import CommentCell from './CommentCell';
import ResultDropdown from './ResultDropdown';
import ReviewCell from './ReviewCell';
import StatusDropdown from './StatusDropdown';

interface Props {
  attendanceItem: AttendanceItem;
  missionDetail?: Mission;
  th?: number;
  bgColor: 'DARK' | 'LIGHT';
  isChecked: boolean;
  setIsCheckedList: (isCheckedList: any) => void;
  refetch: () => void;
}

const TableRow = ({
  attendanceItem,
  missionDetail,
  bgColor,
  isChecked,
  setIsCheckedList,
  refetch,
}: Props) => {
  const { currentChallenge } = useAdminCurrentChallenge();
  const [attendanceResult, setAttendanceResult] = useState(
    attendanceItem.attendance.result,
  );

  const { mutate: updateAttendance } = usePatchChallengeAttendance({
    errorCallback: (error) => {
      alert(error);
    },
  });

  const cellWidthList = challengeSubmitDetailCellWidthList;

  const handleToggle = () => {
    updateAttendance({
      attendanceId: attendanceItem.attendance.id,
      challengeId: currentChallenge?.id,
      missionId: missionDetail?.id,
      reviewIsVisible: !attendanceItem.attendance.reviewIsVisible,
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
        attendance={attendanceItem.attendance}
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
        {attendanceItem.attendance?.createDate?.format('YYYY-MM-DD HH:mm')}
      </div>

      {/* 이름 */}
      <div
        className={clsx(
          'my-auto overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center text-sm',
          cellWidthList[2],
        )}
      >
        {attendanceItem.attendance.name}
      </div>

      {/* 메일 */}
      <div
        className={clsx(
          'my-auto overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center text-sm',
          cellWidthList[3],
        )}
      >
        {attendanceItem.attendance.email}
      </div>

      {/* 옵션 코드 */}
      <div
        className={clsx(
          'my-auto overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center text-sm',
          cellWidthList[4],
        )}
      >
        {attendanceItem.optionCodes.length > 0
          ? attendanceItem.optionCodes.join(', ')
          : '-'}
      </div>

      {/* 제출현황 */}
      <StatusDropdown
        attendance={attendanceItem.attendance}
        cellWidthListIndex={5}
        refetch={refetch}
      />

      {/* 미션 */}
      <div
        className={clsx(
          'my-auto overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center text-sm',
          cellWidthList[6],
        )}
      >
        {attendanceItem.attendance.link && (
          <Link
            to={attendanceItem.attendance.link}
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
        attendance={attendanceItem.attendance}
        attendanceResult={attendanceResult}
        setAttendanceResult={setAttendanceResult}
        setIsRefunded={() => {}}
        cellWidthListIndex={7}
      />
      <CommentCell
        attendance={attendanceItem.attendance}
        cellWidthListIndex={8}
      />
      <ReviewCell
        review={attendanceItem.attendance.review ?? undefined}
        cellWidthListIndex={9}
      />
      <div
        className={clsx(
          'overflow-hidden text-ellipsis py-3 text-center text-sm',
          cellWidthList[10],
        )}
      >
        <Switch
          checked={attendanceItem.attendance.reviewIsVisible ?? false}
          onChange={handleToggle}
        />
      </div>
    </div>
  );
};

export default TableRow;
