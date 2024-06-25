import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosLink } from 'react-icons/io';
import { UserChallengeMissionDetail } from '../../../../../schema';

interface Props {
  missionDetail: UserChallengeMissionDetail;
}

const ContentsDropdown = ({ missionDetail }: Props) => {
  const [isMenuShown, setIsMenuShown] = useState(false);
  const additionalContentsLink =
    missionDetail.additionalContentsList?.[0]?.link;
  const essentialContentsLink = missionDetail.essentialContentsList?.[0]?.link;

  return (
    <div className="relative flex-1">
      <div
        className="rounded cursor-pointer border border-[#DCDCDC] bg-primary px-4 py-2 text-center font-semibold text-white shadow"
        onClick={() => setIsMenuShown(!isMenuShown)}
      >
        학습 콘텐츠
      </div>
      {isMenuShown && (essentialContentsLink || additionalContentsLink) && (
        <ul className="rounded absolute bottom-[-0.25rem] w-full translate-y-[100%] border border-[#DCDCDC] bg-white text-sm">
          {essentialContentsLink && (
            <li>
              <Link
                to={essentialContentsLink}
                className="flex w-full items-center justify-between px-4 py-3 text-primary hover:bg-gray-200"
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
                className="flex w-full items-center justify-between px-4 py-3 text-primary hover:bg-gray-200"
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

export default ContentsDropdown;
