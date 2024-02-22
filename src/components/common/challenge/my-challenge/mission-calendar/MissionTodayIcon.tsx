import clsx from 'clsx';
import { Link, useParams } from 'react-router-dom';
import { FaCheck, FaPlus } from 'react-icons/fa6';

import { missionSubmitToBadge } from '../../../../../utils/convert';

interface Props {
  mission: any;
  className: string;
}

const MissionTodayIcon = ({ mission, className }: Props) => {
  const params = useParams();

  return (
    <>
      <Link
        to={`/challenge/${params.programId}/me?scroll_to=daily-mission`}
        replace
        className={clsx(
          'flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md shadow-[0px_0px_10px_rgba(0,0,0,0.1)]',
          className,
        )}
      >
        {mission.attendanceStatus !== 'ABSENT' ? (
          <div className="mb-[0.175rem] flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full bg-primary">
            <i className="text-2xl text-white">
              <FaCheck />
            </i>
          </div>
        ) : mission.missionType === 'ADDITIONAL' ? (
          <div className="mb-[0.175rem] flex h-[2.5rem] w-[2.5rem] items-center justify-center">
            <i>
              <img
                src="/icons/additional-contents.svg"
                alt="additional contents icon"
              />
            </i>
          </div>
        ) : mission.missionType === 'REFUND' ? (
          <div className="mb-[0.175rem] flex h-[2.5rem] w-[2.5rem] items-center justify-center">
            <i>
              <img src="/icons/refund.svg" alt="refund icon" />
            </i>
          </div>
        ) : (
          mission.missionType === 'GENERAL' && (
            <div className="mb-[0.175rem] flex h-[2.5rem] w-[2.5rem] items-center justify-center">
              <i>
                <img
                  src="/icons/general-mission.svg"
                  alt="general mission icon"
                />
              </i>
            </div>
          )
        )}
        <span className="font-pretendard text-sm font-semibold text-primary">
          {mission.missionTh}일차
        </span>
      </Link>
      <div className="mt-2 flex items-center justify-center">
        <span
          className={clsx(
            'rounded-md px-2 py-[0.125rem] text-sm',
            missionSubmitToBadge({
              status: mission.attendanceStatus,
              result: mission.attendanceResult,
              isRefunded: mission.attendanceIsRefunded,
            }).style,
            {
              'opacity-0': mission.attendanceStatus === 'ABSENT',
            },
          )}
        >
          {
            missionSubmitToBadge({
              status: mission.attendanceStatus,
              result: mission.attendanceResult,
              isRefunded: mission.attendanceIsRefunded,
            }).text
          }
        </span>
      </div>
    </>
  );
};

export default MissionTodayIcon;
