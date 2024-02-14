import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosLink } from 'react-icons/io';

interface Props {
  missionDetail: any;
}

const RewardContentsDropdown = ({ missionDetail }: Props) => {
  const [isMenuShown, setIsMenuShown] = useState(false);

  return (
    <div className="relative">
      <button
        className="w-full rounded border border-[#BCBCBC] px-4 py-2 font-medium"
        onClick={() => setIsMenuShown(!isMenuShown)}
      >
        리워드 콘텐츠 확인하기
      </button>
      {isMenuShown && (
        <ul className="absolute -bottom-1 w-full translate-y-full rounded border border-[#BCBCBC] bg-white">
          {missionDetail.additionalContentsId && (
            <li>
              <Link
                to="#"
                className="flex items-center justify-between px-5 py-3 text-center text-primary duration-200 hover:bg-gray-100"
              >
                <span>추가 콘텐츠</span>
                <i>
                  <IoIosLink />
                </i>
              </Link>
            </li>
          )}
          {missionDetail.limitedContentsId && (
            <li>
              <Link
                to="#"
                className="flex items-center justify-between px-5 py-3 text-center text-primary duration-200 hover:bg-gray-100"
              >
                <span>제한 콘텐츠</span>
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

export default RewardContentsDropdown;
