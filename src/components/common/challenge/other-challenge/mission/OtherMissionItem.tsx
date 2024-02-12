import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

interface Props {
  mission: any;
}

const OtherMissionItem = ({ mission }: Props) => {
  const [isMenuShown, setIsMenuShown] = useState(false);
  const [recordMap, setRecordMap] = useState<any>();

  return (
    <li>
      <div
        className="cursor-pointer rounded-xl border border-[#D9D9D9] bg-white px-8 py-6 font-medium transition-colors duration-150 hover:bg-[#F8F8F8]"
        onClick={() => setIsMenuShown(true)}
      >
        {mission.missionTh}일차. {mission.missionTitle}
      </div>
      {isMenuShown && (
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
      )}
    </li>
  );
};

export default OtherMissionItem;
