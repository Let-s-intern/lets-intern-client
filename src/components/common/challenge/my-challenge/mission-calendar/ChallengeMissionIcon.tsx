import clsx from 'clsx';
import { Link, useParams } from 'react-router-dom';
import { Schedule } from '../../../../../schema';

import { challengeMissionSubmitToBadge } from '../../../../../utils/convert';

interface Props {
  className?: string;
  schedule: Schedule;
  isDone: boolean;
}
// 새로운 버전
const MissionIcon = ({ className, schedule, isDone }: Props) => {
  const params = useParams();
  const mission = schedule.missionInfo;
  const attendance = schedule.attendanceInfo;

  // const attendance = {
  //   result: 'WRONG', // 예시 값: 'PASS', 'WAITING', 'WRONG'
  //   status: 'PRESENT', // 예시 값: 'PRESENT', 'UPDATED', 'LATE', 'ABSENT'
  // };

  // "대기 중"|"합격" + "결석X" -> true
  // result : "WAITING:확인중/", "PASS:확인 완료", "WRONG:반려/"
  // status : "PRESENT:정상제출/", "UPDATED:다시 제출", "LATE:지각 제출/", "ABSENT:미제출/"

  // 제출전 : 진행중
  // 제출후 : 제출 확인중
  // 정상제출(PRESENT), 미제출(ABSENT), 지각제출(LATE), 반려(WRONG)
  const isAttended =
    (attendance.result === 'WAITING' || attendance.result === 'PASS') &&
    attendance.status !== 'ABSENT';

  return (
    <>
      <Link
        to={
          !isDone
            ? `/challenge/${params.applicationId}/${params.programId}/me?scroll_to_mission=${mission.id}`
            : '#'
        }
        replace
        className={clsx('relative aspect-square cursor-pointer', className)}
      >
        {isAttended ? (
          <i className="block h-3.5 w-3.5">
            <img
              src="/icons/check-circle.svg"
              alt="check-icon"
              className="w-full object-cover"
            />
          </i>
        ) : (
          <i className="block h-3.5 w-3.5">
            <img
              src="/icons/check-gray-outline.svg"
              alt="not-started-icon"
              className="object-cover"
            />
          </i>
        )}
      </Link>
      <div className="justify-left mt-1 flex text-sm font-semibold">
        <span
          className={clsx(
            'justify-self-center rounded-xs text-[13px] leading-4',
            challengeMissionSubmitToBadge({
              status: attendance.status || 'ABSENT',
              result: attendance.result,
            }).style,
            attendance.result === 'PASS' ? 'text-[14px]' : '',
          )}
        >
          {attendance.result === 'WAITING' ? (
            <>
              제출
              <br />
            </>
          ) : (
            <>
              {mission.th}회차
              <br />
            </>
          )}
          {
            challengeMissionSubmitToBadge({
              status: attendance.status || 'ABSENT',
              result: attendance.result,
            }).text
          }
        </span>
      </div>
    </>
  );
};

export default MissionIcon;
