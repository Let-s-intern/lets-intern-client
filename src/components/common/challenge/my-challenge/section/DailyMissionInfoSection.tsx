import { Link } from 'react-router-dom';
import { UserChallengeMissionDetail } from '../../../../../schema';
import { formatMissionDateString } from '../../../../../utils/formatDateString';
import ContentsDropdown from '../dropdown/ContentsDropdown';

interface Props {
  missionDetail: UserChallengeMissionDetail;
}

const DailyMissionInfoSection = ({ missionDetail }: Props) => {
  return (
    <>
      <div className="flex items-end gap-2">
        <h3 className="text-xl font-semibold">
          {missionDetail.th}회차. {missionDetail.title}
        </h3>
        <span className="text-sm text-[#4A495C]">
          마감 {missionDetail.endDate.format('MM/DD(ddd) HH:mm')}까지
        </span>
      </div>
      <p className="mt-2 whitespace-pre-line text-black">
        {missionDetail.description}
      </p>
      <div className="mt-3">
        <h4 className="text-sm font-semibold text-[#898989]">미션 가이드</h4>
        <p className="mt-1 whitespace-pre-line text-black">
          {missionDetail.guide}
        </p>
      </div>
      <div className="mt-5 flex gap-4">
        <Link
          to={missionDetail.templateLink}
          className="rounded flex-1 border border-[#DCDCDC] bg-white px-8 py-2 text-center font-semibold shadow"
          target="_blank"
          rel="noopenner noreferrer"
        >
          미션 템플릿
        </Link>
        <ContentsDropdown missionDetail={missionDetail} />
      </div>
    </>
  );
};

export default DailyMissionInfoSection;
