import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { DailyMission } from '@/schema';
import { Link, useParams } from 'react-router-dom';

const DailyMissionSection = ({
  dailyMission,
}: {
  dailyMission: DailyMission;
}) => {
  const applicationId = useParams().applicationId;
  const { currentChallenge } = useCurrentChallenge();

  const missionTitle =
    dailyMission?.th === 100
      ? '보너스 미션'
      : `${dailyMission?.th}회차. ${dailyMission?.title}`;

  const missionDescription =
    dailyMission?.th === 100
      ? '안녕하세요, 커리어의 첫걸음을 함께하는 렛츠커리어입니다!\n렛츠커리어의 챌린지 프로그램을 믿고 따라와주셔서 감사드리며, 1만원을 100% 지급해드리는 후기 이벤트를 안내드립니다!'
      : dailyMission?.description;

  return (
    <section className="flex flex-1 flex-col rounded-xl border border-[#E4E4E7] p-6">
      <div className="flex items-end gap-2">
        <h2 className="font-semibold text-[#4A495C]">{missionTitle}</h2>
        <span className="text-sm text-[#7D7D7D]">
          {dailyMission?.endDate?.format('MM/DD(ddd) HH:mm')}까지
        </span>
      </div>
      <p className="mt-2 line-clamp-6 flex-1 whitespace-pre-line">
        {missionDescription}
      </p>
      <Link
        to={`/challenge/${applicationId}/${currentChallenge?.id}/me?scroll_to=daily-mission`}
        className="mt-4 w-full rounded-xxs bg-primary px-4 py-3 text-center font-semibold text-white"
      >
        미션 수행하기
      </Link>
    </section>
  );
};

export default DailyMissionSection;
