import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosLink } from 'react-icons/io';

interface Props {
  missionDetail: any;
}

const AbsentContentsDropdown = ({ missionDetail }: Props) => {
  const [isMenuShown, setIsMenuShown] = useState(false);

  return (
    <div className="relative flex-1">
      <div
        className="cursor-pointer rounded border border-[#DCDCDC] bg-primary px-4 py-2 text-center font-semibold text-white shadow"
        onClick={() => setIsMenuShown(!isMenuShown)}
      >
        학습 콘텐츠
      </div>
      {isMenuShown &&
        (missionDetail.essentialContentsLink ||
          missionDetail.additionalContentsLink) && (
          <ul className="absolute bottom-[-0.25rem] w-full translate-y-[100%] rounded border border-[#DCDCDC] bg-white text-sm">
            {missionDetail.essentialContentsLink && (
              <li>
                <Link
                  to={missionDetail.essentialContentsLink}
                  className="flex flex-1 items-center justify-between px-4 py-3 text-primary duration-200 hover:bg-gray-200"
                  target="_blank"
                  rel="noopenner noreferrer"
                >
                  <span>필수 콘텐츠</span>
                  <i>
                    <IoIosLink />
                  </i>
                </Link>
              </li>
            )}
            {missionDetail.additionalContentsLink && (
              <li>
                <Link
                  to={missionDetail.additionalContentsLink}
                  className="flex flex-1 items-center justify-between px-4 py-3 text-primary hover:bg-gray-200"
                  target="_blank"
                  rel="noopenner noreferrer"
                >
                  <span>추가 콘텐츠</span>
                  <i>
                    <IoIosLink />
                  </i>
                </Link>
              </li>
            )}
          </ul>
        )}
    </div>
  );
};

export default AbsentContentsDropdown;
