import { Link, useParams } from 'react-router-dom';

import { formatMissionDateString } from '../../../../../utils/formatDateString';

interface Props {
  dailyMission: any;
  isLoading: boolean;
}

const DailyMissionSection = ({ dailyMission, isLoading }: Props) => {
  const params = useParams();

  if (isLoading) {
    return <section className="mb-10">로딩 중...</section>;
  }

  return (
    <section className="flex flex-1 flex-col gap-2 rounded-xl border border-[#E4E4E7] p-6">
      <div className="flex items-end gap-2">
        <h2 className="font-semibold text-[#4A495C]">
          {dailyMission.th}일차. {dailyMission.title}
        </h2>
        <span className="text-sm text-[#7D7D7D]">
          {formatMissionDateString(dailyMission.endDate)}까지
        </span>
      </div>
      <p className="flex-1">{dailyMission.contents}</p>
      <Link
        to={`/challenge/${params.programId}/me`}
        className="w-full rounded bg-primary px-4 py-3 text-center font-semibold text-white"
      >
        오늘의 미션 수행하기
      </Link>
    </section>
  );
};

export default DailyMissionSection;
