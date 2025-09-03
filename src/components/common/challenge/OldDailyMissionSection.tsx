import { useOldCurrentChallenge } from '@/context/OldCurrentChallengeProvider';
import { DailyMission } from '@/schema';
import { Link, useParams } from 'react-router-dom';

const OldDailyMissionSection = ({
  dailyMission,
}: {
  dailyMission: DailyMission;
}) => {
  const applicationId = useParams().applicationId;
  const { currentChallenge } = useOldCurrentChallenge();
  return (
    <section className="flex flex-1 flex-col rounded-xl border border-[#E4E4E7] p-6">
      <div className="flex items-end gap-2">
        <h2 className="font-semibold text-[#4A495C]">
          {dailyMission?.th}회차. {dailyMission?.title}
        </h2>
        <span className="text-sm text-[#7D7D7D]">
          {dailyMission?.endDate?.format('MM/DD(ddd) HH:mm')}까지
        </span>
      </div>
      <p className="mt-2 line-clamp-6 flex-1 whitespace-pre-line">
        {dailyMission?.description}
      </p>
      <Link
        to={`/old/challenge/${applicationId}/${currentChallenge?.id}/me?scroll_to=daily-mission`}
        className="mt-4 w-full rounded-xxs bg-primary px-4 py-3 text-center font-semibold text-white"
      >
        {dailyMission?.th}회차 미션 수행하기
      </Link>
    </section>
  );
};

export default OldDailyMissionSection;
