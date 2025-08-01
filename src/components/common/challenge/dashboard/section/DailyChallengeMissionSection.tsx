import { useMissionStore } from '@/store/useMissionStore';
import clsx from 'clsx';
import dayjs from 'dayjs';
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
    const id = dailyMission?.id;
    const th = dailyMission?.th;

    const isValidId = typeof id === 'number';
    const isValidTh = typeof th === 'number';

    if (isValidId && isValidTh) {
      setSelectedMission(id, th);
      navigate(
        `/challenge/${currentChallenge?.id}/dashboard/${applicationId}/missions`,
        { replace: true },
      );
    }
  };

  const isBeforeStart = dayjs().isBefore(currentChallenge?.startDate);

  const submitted =
    typeof todayTh === 'number' &&
    schedules[todayTh - 1]?.attendanceInfo?.submitted;

  return (
    <section
      className={clsx(
        'flex min-h-[240px] flex-1 flex-col rounded-xs border md:min-h-[180px] lg:aspect-[122/90]',
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
      {!isBeforeStart && (
        <button
          onClick={handleClick}
          className="mx-4 mb-4 rounded-xs bg-primary px-4 py-3 text-center text-white"
        >
          {submitted ? '제출 수정하기' : '미션 수행하기'}
        </button>
      )}
    </section>
  );
};

export default DailyChallengeMissionSection;
