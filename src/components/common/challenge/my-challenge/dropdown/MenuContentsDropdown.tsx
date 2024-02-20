import { useState } from 'react';
import { IoIosLink } from 'react-icons/io';
import { Link } from 'react-router-dom';

interface Props {
  missionDetail: any;
}

const MenuContentsDropdown = ({ missionDetail }: Props) => {
  const [isMenuShown, setIsMenuShown] = useState(false);

  return (
    <div className="relative">
      <button
        className="w-full rounded border border-[#BCBCBC] px-4 py-2 font-medium"
        onClick={() => setIsMenuShown(!isMenuShown)}
      >
        학습 콘텐츠 확인하기
      </button>
      {isMenuShown && (
        <ul className="absolute -bottom-1 w-full translate-y-full rounded border border-[#BCBCBC] bg-white">
          {missionDetail.essentialContentsLink && (
            <li>
              <Link
                to={missionDetail.essentialContentsLink}
                className="flex items-center justify-between px-5 py-3 text-center text-primary duration-200 hover:bg-gray-100"
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
                className="flex items-center justify-between px-5 py-3 text-center text-primary duration-200 hover:bg-gray-100"
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

export default MenuContentsDropdown;
