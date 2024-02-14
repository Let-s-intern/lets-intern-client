import { Link } from 'react-router-dom';
import { formatMissionDateString } from '../../../../../utils/formatDateString';
import TemplateDropdown from '../dropdown/TemplateDropdown';

interface Props {
  dailyMission: any;
}

const DailyMissionInfoSection = ({ dailyMission }: Props) => {
  return (
    <>
      <div className="flex items-end gap-2">
        <h3 className="text-xl font-semibold">
          {dailyMission.th}일차. {dailyMission.title}
        </h3>
        <span className="text-sm text-[#4A495C]">
          마감 {formatMissionDateString(dailyMission.endDate)}까지
        </span>
      </div>
      <p className="mt-2 text-black">{dailyMission.contents}</p>
      <div className="mt-3">
        <h4 className="text-sm font-semibold text-[#898989]">미션 가이드</h4>
        <p className="mt-1 text-black">{dailyMission.guide}</p>
      </div>
      <div className="mt-5 flex gap-4">
        <Link
          to={dailyMission.template}
          className="flex-1 rounded border border-[#DCDCDC] bg-white px-8 py-2 text-center font-semibold shadow"
          target="_blank"
          rel="noopenner noreferrer"
        >
          미션 템플릿
        </Link>
        <TemplateDropdown dailyMission={dailyMission} />
      </div>
    </>
  );
};

export default DailyMissionInfoSection;
