import { useMissionStore } from '@/store/useMissionStore';
import clsx from 'clsx';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentChallenge } from '../../../../../context/CurrentChallengeProvider';
import { DailyMission, Schedule } from '../../../../../schema';

// 새로운 버전
interface Props {
  dailyMission: DailyMission;
  todayTh: number;
  schedules: Schedule[];
}

const DailyChallengeMissionSection = ({
  dailyMission,
  todayTh,
  schedules,
}: Props) => {
  const applicationId = useParams().applicationId;
  const { currentChallenge } = useCurrentChallenge();

  const navigate = useNavigate();
  const { setSelectedMission } = useMissionStore();

  const handleClick = () => {
    if (dailyMission?.id != null && dailyMission?.th != null) {
      setSelectedMission(dailyMission.id, dailyMission.th);
      navigate(
        `/challenge/${currentChallenge?.id}/dashboard/${applicationId}/missions`,
        { replace: true },
      );
    }
  };

  const submitted =
    typeof todayTh === 'number' &&
    schedules[todayTh - 1]?.attendanceInfo?.submitted;

  return (
    <section
      className={clsx(
        'flex aspect-[122/90] flex-1 flex-col rounded-xs border',
        submitted ? 'border-neutral-80' : 'border-primary-80',
      )}
    >
      <div className="flex flex-col border-b px-4 py-3 md:flex-row md:items-center md:py-4">
        <h2 className="flex flex-row">
          <span className="relative inline-block font-semibold text-neutral-10 after:mx-[6px] after:h-[18px] after:border-r after:border-neutral-60 after:content-['']">
            {dailyMission?.th}회차
          </span>
          <span className="mr-2 font-semibold text-neutral-10">
            {dailyMission?.title}
          </span>
        </h2>
        <span className="text-xsmall14 text-primary">
          마감기한 {dailyMission?.endDate?.format('MM.DD HH:mm')}까지
        </span>
      </div>
      <p className="mb-4 flex-1 whitespace-pre-line p-4 text-xsmall14 text-neutral-0 md:mb-0 md:text-xsmall16">
        {dailyMission?.description}
      </p>
      <button
        onClick={handleClick}
        className="mx-4 mb-4 rounded-xs bg-primary px-4 py-3 text-center text-white"
      >
        {submitted ? '제출 수정하기' : '미션 수행하기'}
      </button>
    </section>
  );
};

export default DailyChallengeMissionSection;
