import { Link, useParams } from 'react-router-dom';
import { useCurrentChallenge } from '../../../../../context/CurrentChallengeProvider';
import { DailyMission } from '../../../../../schema';

// 새로운 버전
const DailyChallengeMissionSection = ({
  dailyMission,
}: {
  dailyMission: DailyMission;
  isDone: boolean;
}) => {
  const applicationId = useParams().applicationId;
  const { currentChallenge } = useCurrentChallenge();
  return (
    <section className="flex flex-1 flex-col rounded-xs border border-neutral-80">
      <div className="flex items-center gap-2 border-b p-4">
        <h2 className="font-semibold text-[#4A495C]">
          {dailyMission?.th}회차 | {dailyMission?.title}
        </h2>
        <span className="text-sm text-primary">
          마감기한 {dailyMission?.endDate?.format('MM.DD HH:mm')}까지
        </span>
      </div>
      <p className="line-clamp-6 flex-1 whitespace-pre-line p-4">
        {dailyMission?.description}
      </p>
      <Link
        to={`/challenge/${applicationId}/${currentChallenge?.id}/me?scroll_to=daily-mission`}
        className="mx-4 mb-4 rounded-xxs bg-primary px-4 py-3 text-center font-semibold text-white"
      >
        미션 수행하기
      </Link>
    </section>
  );
};

export default DailyChallengeMissionSection;
