import { useCurrentChallenge } from '@/context/CurrentChallengeProvider';
import { Link, useParams } from 'react-router-dom';

const MissionEndSection = () => {
  const applicationId = useParams().applicationId;
  const { currentChallenge } = useCurrentChallenge();

  return (
    <>
      <section className="flex min-h-[240px] shrink-0 flex-col rounded-xs border border-neutral-80 md:h-[360px] md:min-h-[180px] md:w-[488px]">
        <div className="flex flex-col border-b px-4 py-3 md:flex-row md:items-center md:py-4">
          <h2 className="font-semibold text-neutral-10">
            🎉 모든 미션이 완료되었습니다 🎉
          </h2>
        </div>
        <div></div>
        <p className="mb-4 line-clamp-[9] flex-1 overflow-hidden whitespace-pre-line p-4 text-xsmall14 font-medium text-neutral-0 md:mb-0 md:text-xsmall16">
          챌린지 끝까지 완주하신 것을 축하드려요! <br />
          렛츠커리어와 함께한 여정이 여러분의 성장에 도움이 되었길 바랍니다.{' '}
          <br />
          이전 미션들은 나의 기록장에서 확인하실 수 있습니다.
        </p>
        <Link
          to={`/challenge/${currentChallenge?.id}/dashboard/${applicationId}/missions`}
          className="m-3 rounded-xs bg-primary p-3 text-center font-medium text-white"
        >
          이전 미션 돌아보기
        </Link>
      </section>
    </>
  );
};

export default MissionEndSection;
