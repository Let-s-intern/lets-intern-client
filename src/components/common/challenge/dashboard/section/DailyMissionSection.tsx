import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { DailyMission, Schedule } from '@/schema';
import { BONUS_MISSION_TH } from '@/utils/constants';
import clsx from 'clsx';
import { Link, useParams } from 'react-router-dom';

const DailyMissionSection = ({
  dailyMission,
  schedules,
}: {
  dailyMission: DailyMission;
  schedules: Schedule[];
}) => {
  const applicationId = useParams().applicationId;
  const { currentChallenge } = useCurrentChallenge();

  const missionTh =
    dailyMission?.th === BONUS_MISSION_TH
      ? '보너스 미션'
      : `${dailyMission?.th}회차`;

  const missionName =
    dailyMission?.th === BONUS_MISSION_TH ? '' : dailyMission?.title;

  const missionDescription =
    dailyMission?.th === BONUS_MISSION_TH
      ? '안녕하세요, 커리어의 첫걸음을 함께하는 렛츠커리어입니다!\n렛츠커리어의 챌린지 프로그램을 믿고 따라와주셔서 감사드리며, 1만원을 100% 지급해드리는 후기 이벤트를 안내드립니다!'
      : dailyMission?.description;

  const isSubmitted =
    schedules.find((schedule) => schedule.missionInfo.id === dailyMission?.id)
      ?.attendanceInfo?.submitted ?? false;

  return (
    <section
      className={clsx(
        'flex flex-1 flex-col rounded-xs border md:h-[360px] md:min-h-[180px] md:w-[488px]',
        isSubmitted ? 'border-neutral-80' : 'border-primary-80',
      )}
    >
      <div className="flex items-center gap-2 border-b p-4">
        <h2 className="flex flex-row font-semibold text-[#4A495C]">
          <span className="relative inline-block font-semibold text-neutral-10 after:mx-[6px] after:h-[18px] after:border-r after:border-neutral-60 after:content-['']">
            {missionTh}
          </span>
          <span>{missionName}</span>
        </h2>
        <span className="text-xsmall14 text-primary">
          마감기한 {dailyMission?.endDate?.format('MM.DD HH:mm')}까지
        </span>
      </div>
      <div className="flex-1 overflow-hidden p-4">
        <p className="mb-4 line-clamp-[9] whitespace-pre-line text-xsmall14 text-neutral-0 md:mb-0 md:text-xsmall16">
          {missionDescription}
        </p>
      </div>
      <Link
        to={`/challenge/${applicationId}/${currentChallenge?.id}/me?scroll_to=daily-mission`}
        className="m-4 rounded-xs bg-primary py-3 text-center font-semibold text-white"
      >
        {isSubmitted ? '제출 수정하기' : '미션 수행하기'}
      </Link>
    </section>
  );
};

export default DailyMissionSection;
