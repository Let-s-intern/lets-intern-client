import { Link } from 'react-router-dom';
// import RewardContentsLink from '../link/RewardContentsLink';
import {
  MyChallengeMissionByType,
  Schedule,
  UserChallengeMissionDetail,
} from '../../../../../schema';
import MenuContentsDropdown from '../dropdown/MenuContentsDropdown';
interface Props {
  missionDetail: UserChallengeMissionDetail;
  // dailyMission: DailyMission;
  missionByType: MyChallengeMissionByType;
  schedule: Schedule;
}

const DoneMissionDetailMenu = ({
  missionDetail,
  missionByType,
  schedule,
}: Props) => {
  const additionalContentsLink =
    missionDetail.additionalContentsList?.[0]?.link;
  const essentialContentsLink = missionDetail.essentialContentsList?.[0]?.link;

  return (
    <>
      <hr className="my-4 border-[#DEDEDE]" />
      <div className="px-3">
        <p className="whitespace-pre-line text-black">
          {missionDetail.description}
        </p>
        <div className="mt-4">
          <h4 className="text-sm text-[#898989]">미션 가이드</h4>
          <p className="mt-1 whitespace-pre-line text-black">
            {missionDetail.guide}
          </p>
        </div>
        {(additionalContentsLink || essentialContentsLink) && (
          <div className="mt-4 flex flex-col gap-2">
            <MenuContentsDropdown missionDetail={missionDetail} />
          </div>
        )}
      </div>
      <hr className="my-4 border-[#DEDEDE]" />
      <div className="px-3">
        <div className="flex items-center gap-4 overflow-hidden">
          <h4 className="flex-shrink-0 text-lg font-semibold">제출한 미션</h4>
          <Link
            to={missionByType.attendanceLink ?? ''}
            target="_blank"
            rel="noopenner noreferrer"
            className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-gray-500 hover:underline"
          >
            {missionByType.attendanceLink}
          </Link>
        </div>
        {schedule.attendanceInfo.comments && (
          <div className="mt-4">
            <div className="rounded-md bg-[#F2F2F2] px-8 py-6 text-sm">
              {schedule.attendanceInfo.comments}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DoneMissionDetailMenu;
