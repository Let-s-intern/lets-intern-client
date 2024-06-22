import { useState } from 'react';
import { IoIosLink } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { UserChallengeMissionDetail } from '../../../../../schema';

interface Props {
  missionDetail: UserChallengeMissionDetail;
}

const MenuContentsDropdown = ({ missionDetail }: Props) => {
  const [isMenuShown, setIsMenuShown] = useState(false);
  const additionalContentsLink =
    missionDetail.additionalContentsList?.[0]?.link;
  const essentialContentsLink = missionDetail.essentialContentsList?.[0]?.link;

  return (
    <div className="relative">
      <button
        className="rounded w-full border border-[#BCBCBC] px-4 py-2 font-medium"
        onClick={() => setIsMenuShown(!isMenuShown)}
      >
        학습 콘텐츠 확인하기
      </button>
      {isMenuShown && (
        <ul className="rounded absolute -bottom-1 w-full translate-y-full border border-[#BCBCBC] bg-white">
          {essentialContentsLink && (
            <li>
              <Link
                to={essentialContentsLink}
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
          {additionalContentsLink && (
            <li>
              <Link
                to={additionalContentsLink}
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
