import { Link, useParams } from 'react-router-dom';
import { useCurrentChallenge } from '../../../../../context/CurrentChallengeProvider';

const EndDailyMissionSection = () => {
  const applicationId = useParams().applicationId;
  const { currentChallenge } = useCurrentChallenge();
  return (
    <section className="flex flex-1 flex-col rounded-xl border border-[#E4E4E7] p-6">
      <div className="flex items-end gap-2">
        <h2 className="w-full text-center font-semibold text-[#4A495C]">
          챌린지가 종료되었습니다.
        </h2>
      </div>
      <p className="mt-2 line-clamp-6 flex-1 whitespace-pre-line text-center">
        나의 기록장에서 이전 미션들을 확인하실 수 있습니다.
      </p>
      <Link
        to={`/challenge/${applicationId}/${currentChallenge?.id}/me`}
        className="mt-4 w-full rounded-xxs bg-primary px-4 py-3 text-center font-semibold text-white"
      >
        이전 미션 돌아보기
      </Link>
    </section>
  );
};

export default EndDailyMissionSection;
