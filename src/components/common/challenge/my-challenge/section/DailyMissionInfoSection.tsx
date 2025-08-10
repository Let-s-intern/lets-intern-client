import { UserChallengeMissionDetail } from '@/schema';
import { Link } from 'react-router-dom';
import OtVideo from '../../OtVideo';
import ContentsDropdown from '../dropdown/ContentsDropdown';

interface Props {
  missionDetail: UserChallengeMissionDetail;
}

const DailyMissionInfoSection = ({ missionDetail }: Props) => {
  const isOtMission = missionDetail.th === 0;

  return (
    <>
      <div className="flex items-end gap-2">
        <h3 className="text-small20 font-bold">
          {missionDetail.th}회차. {missionDetail.title}
        </h3>
        <span className="text-xsmall16 font-medium text-primary">
          마감 {missionDetail.endDate.format('MM/DD(ddd) HH:mm')}까지
        </span>
      </div>
      <p className="mt-5 whitespace-pre-line text-black">
        {missionDetail.description}
      </p>
      <div className="mt-8">
        <h4 className="text-small18 font-semibold text-primary">미션 가이드</h4>
        <p className="mt-5 whitespace-pre-line text-xsmall16 font-medium text-black">
          {missionDetail.guide}
        </p>
      </div>
      <div className="mt-8 flex gap-4">
        {!isOtMission && (
          <Link
            to={missionDetail.templateLink}
            className="flex-1 rounded-sm border border-primary-20 bg-white p-3 text-center text-xsmall16 font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            미션 템플릿
          </Link>
        )}
        <ContentsDropdown missionDetail={missionDetail} />
      </div>
      {isOtMission && missionDetail.vodLink && (
        <OtVideo vodLink={missionDetail.vodLink} />
      )}
    </>
  );
};

export default DailyMissionInfoSection;
