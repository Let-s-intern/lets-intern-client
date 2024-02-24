import { Link } from 'react-router-dom';

import RewardContentsLink from '../link/RewardContentsLink';
import MenuContentsDropdown from '../dropdown/MenuContentsDropdown';

interface Props {
  missionDetail: any;
}

const DoneMissionDetailMenu = ({ missionDetail }: Props) => {
  return (
    <>
      <hr className="my-4 border-[#DEDEDE]" />
      <div className="px-3">
        <p className="whitespace-pre-line text-black">
          {missionDetail.contents}
        </p>
        {(missionDetail.essentialContentsLink ||
          missionDetail.additionalContentsLink ||
          missionDetail.limitedContentsLink) && (
          <div className="mt-4 flex flex-col gap-2">
            {(missionDetail.essentialContentsLink ||
              missionDetail.additionalContentsLink) && (
              <MenuContentsDropdown missionDetail={missionDetail} />
            )}
            {missionDetail.limitedContentsLink && (
              <RewardContentsLink missionDetail={missionDetail} />
            )}
          </div>
        )}
      </div>
      <hr className="my-4 border-[#DEDEDE]" />
      <div className="px-3">
        <div className="flex items-center gap-4">
          <h4 className="whitespace-nowrap text-lg font-semibold">
            제출한 미션
          </h4>
          <Link
            to={missionDetail.attendanceLink}
            target="_blank"
            rel="noopenner noreferrer"
            className="overflow-hidden text-ellipsis whitespace-nowrap text-gray-500 hover:underline"
          >
            {missionDetail.attendanceLink}
          </Link>
        </div>
        {missionDetail.attendanceComments && (
          <div className="mt-4">
            <div className="rounded-md bg-[#F2F2F2] px-8 py-6 text-sm">
              {missionDetail.attendanceComments}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DoneMissionDetailMenu;
