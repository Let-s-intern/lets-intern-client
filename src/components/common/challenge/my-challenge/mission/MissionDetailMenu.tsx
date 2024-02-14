import { Link } from 'react-router-dom';

import RewardContentsDropdown from '../dropdown/RewardContentsDropdown';
import EssentialContentsLink from '../link/EssentialContentsLink';

interface Props {
  missionDetail: any;
}

const MissionDetailMenu = ({ missionDetail }: Props) => {
  return (
    <>
      <hr className="my-4 border-[#DEDEDE]" />
      <div className="px-3">
        <p className="text-black">{missionDetail.contents}</p>
        {missionDetail.guide && (
          <div className="mt-4">
            <h4 className="text-sm text-[#898989]">미션 가이드</h4>
            <p className="mt-1 text-black">{missionDetail.guide}</p>
          </div>
        )}
        {(missionDetail.essentialContentsId ||
          missionDetail.additionalContentsId ||
          missionDetail.limitedContentsId) && (
          <div className="mt-4 flex flex-col gap-2">
            {missionDetail.essentialContentsId && (
              <EssentialContentsLink missionDetail={missionDetail} />
            )}
            {(missionDetail.additionalContentsId ||
              missionDetail.limitedContentsId) && (
              <RewardContentsDropdown missionDetail={missionDetail} />
            )}
          </div>
        )}
      </div>
      {missionDetail.attendanceLink && (
        <>
          <hr className="my-4 border-[#DEDEDE]" />
          <div className="px-3">
            <div className="flex items-center gap-4">
              <h4 className="text-lg font-semibold">제출한 미션</h4>
              <Link
                to={missionDetail.attendanceLink}
                target="_blank"
                rel="noopenner noreferrer"
                className="text-gray-500 hover:underline"
              >
                {missionDetail.attendanceLink}
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MissionDetailMenu;
