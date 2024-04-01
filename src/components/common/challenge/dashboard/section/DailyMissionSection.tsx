import { Link, useParams } from 'react-router-dom';

import { formatMissionDateString } from '../../../../../utils/formatDateString';
import clsx from 'clsx';

interface Props {
  dailyMission: any;
  isLoading: boolean;
  isDone: boolean;
}

const DailyMissionSection = ({ dailyMission, isLoading, isDone }: Props) => {
  const params = useParams();

  if (isLoading) {
    return <section className="mb-10">로딩 중...</section>;
  }

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
              {dailyMission.th}일차. {dailyMission.title}
            </>
          )}
        </h2>
        {!isDone && (
          <span className="text-sm text-[#7D7D7D]">
            {formatMissionDateString(dailyMission.endDate)}까지
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
          : dailyMission.contents}
      </p>
      <Link
        to={`/challenge/${params.programId}/me${
          !isDone ? '?scroll_to=daily-mission' : ''
        }`}
        className="mt-4 w-full rounded bg-primary px-4 py-3 text-center font-semibold text-white"
      >
        {isDone ? '이전 미션 돌아보기' : '오늘의 미션 수행하기'}
      </Link>
    </section>
  );
};

export default DailyMissionSection;
