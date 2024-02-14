import { useState } from 'react';
import { IoIosLink } from 'react-icons/io';
import { IoMdClose } from 'react-icons/io';
import { Link } from 'react-router-dom';

interface Props {
  mission: any;
}

const OtherMissionItem = ({ mission }: Props) => {
  const [isMenuShown, setIsMenuShown] = useState(false);

  return (
    <li>
      <Link
        to={mission.attendanceLink}
        target="_blank"
        rel="noopenner noreferrer"
        className="flex cursor-pointer items-center justify-between rounded-xl border border-[#D9D9D9] bg-white px-8 py-6 font-medium transition-colors duration-150 hover:bg-[#F8F8F8]"
        onClick={() => setIsMenuShown(true)}
      >
        <span>
          {mission.missionTh}일차. {mission.missionTitle}
        </span>
        <i>
          <IoIosLink />
        </i>
      </Link>
      {/* {isMenuShown && (
        <div
          className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsMenuShown(false)}
        >
          <div className="relative">
            <div
              className="flex h-[35rem] w-[50rem] flex-col rounded-xl bg-white px-14 py-12"
              onClick={(e) => e.stopPropagation()}
            >
              <h1 className="text-xl font-semibold">
                {mission.missionTh}일차. {mission.missionTitle}
              </h1>
              <button
                className="absolute right-9 top-7"
                onClick={() => setIsMenuShown(false)}
              >
                <i className="text-2xl">
                  <IoMdClose />
                </i>
              </button>
            </div>
          </div>
        </div>
      )} */}
    </li>
  );
};

export default OtherMissionItem;
