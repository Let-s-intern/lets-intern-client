import { Link, useParams } from 'react-router-dom';
import { formatMissionDateString } from '../../../../../utils/formatDateString';
import clsx from 'clsx';
import { DailyMission } from '../../../../../schema';
import { useCurrentChallenge } from '../../../../../context/CurrentChallengeProvider';


const DailyMissionSection = ({ dailyMission, isDone }: {
  dailyMission: DailyMission;
  isDone: boolean;
}) => {
  const {currentChallenge} = useCurrentChallenge();
  return (
    <section className="flex flex-1 flex-col rounded-xl border border-[#E4E4E7] p-6">
      <div className="flex items-end gap-2">
        <h2
          className={clsx('font-semibold text-[#4A495C]', {
            'w-full text-center': isDone,
          })}
        >
          {isDone ? (
            '챌린지가 종료되었습니다.'
          ) : (
            <>
              {dailyMission.th}회차. {dailyMission.title}
            </>
          )}
        </h2>
        {!isDone && (
          <span className="text-sm text-[#7D7D7D]">
            {dailyMission.endDate?.format("MM/DD(ddd) HH:mm")}까지
          </span>
        )}
      </div>
      <p
        className={clsx('mt-2 line-clamp-6 flex-1 whitespace-pre-line', {
          'text-center': isDone,
        })}
      >
        {isDone
          ? '나의 기록장에서 이전 미션들을 확인하실 수 있습니다.'
          : dailyMission.description}
      </p>
      <Link
        to={`/challenge/${currentChallenge?.id}/me${
          !isDone ? '?scroll_to=daily-mission' : ''
        }`}
        className="mt-4 w-full rounded-xxs bg-primary px-4 py-3 text-center font-semibold text-white"
      >
        {isDone ? '이전 미션 돌아보기' : `${dailyMission.th}회차 미션 수행하기`}
      </Link>
    </section>
  );
};

export default DailyMissionSection;
