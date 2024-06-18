import { Link } from 'react-router-dom';
// import RewardContentsLink from '../link/RewardContentsLink';
import { DailyMission, UserChallengeMissionDetail } from '../../../../../schema';
import MenuContentsDropdown from '../dropdown/MenuContentsDropdown';
interface Props {
  missionDetail: UserChallengeMissionDetail;
  // dailyMission: DailyMission;
}

const DoneMissionDetailMenu = ({ missionDetail }: Props) => {

  const additionalContentsLink = missionDetail.additionalContentsList?.[0]?.link;
  const essentialContentsLink = missionDetail.essentialContentsList?.[0]?.link;

  return (
    <>
      <hr className="my-4 border-[#DEDEDE]" />
      <div className="px-3">
        <p className="whitespace-pre-line text-black">
          {missionDetail.description}
        </p>
        {(additionalContentsLink ||
          essentialContentsLink 
          // ||
          // missionDetail.limitedContentsLink
        ) && (
          <div className="mt-4 flex flex-col gap-2">
            {/* {(missionDetail.essentialContentsLink ||
              missionDetail.additionalContentsLink) && ( */}
              <MenuContentsDropdown missionDetail={missionDetail} />
            {/* // )} */}
            {/* {missionDetail.limitedContentsLink && (
              <RewardContentsLink missionDetail={missionDetail} />
            )} */}
          </div>
        )}
      </div>
      <hr className="my-4 border-[#DEDEDE]" />
      <div className="px-3">
        <div className="flex items-center gap-4 overflow-hidden">
          <h4 className="flex-shrink-0 text-lg font-semibold">제출한 미션</h4>
          <Link
            // to={missionDetail.attendanceLink}
            to=""
            target="_blank"
            rel="noopenner noreferrer"
            className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-gray-500 hover:underline"
          >
            TODO: 내용 추가
            {/* {missionDetail.attendanceLink} */}
          </Link>
        </div>

        {/* TODO: 내용 추가
        {missionDetail.type === 'GENERAL' && missionDetail.missionComments && (
          <div className="mt-4">
            <div className="rounded-md bg-[#F2F2F2] px-8 py-6 text-sm">
            
              {missionDetail.missionComments}
            </div>
          </div>
        )}
        {missionDetail.attendanceComments && (
          <div className="mt-4">
            <div className="rounded-md bg-[#F2F2F2] px-8 py-6 text-sm">
              {missionDetail.attendanceComments}
            </div>
          </div>
        )} */}
      </div>
    </>
  );
};

export default DoneMissionDetailMenu;
