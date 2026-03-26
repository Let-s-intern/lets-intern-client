import { UserChallengeMissionDetail } from '@/schema';
import { useState } from 'react';
import { IoIosLink } from 'react-icons/io';
import HybridLink from '../../../../common/HybridLink';

interface Props {
  missionDetail: UserChallengeMissionDetail;
}

const MenuContentsDropdown = ({ missionDetail }: Props) => {
  const [isMenuShown, setIsMenuShown] = useState(false);

  const essentialContentsLink = missionDetail.essentialContentsList?.[0]?.link;
  const isOtMission = missionDetail.th === 0;

  return (
    <div className="relative">
      <button
        className="rounded w-full border border-[#BCBCBC] px-4 py-2 font-medium"
        onClick={() => setIsMenuShown(!isMenuShown)}
      >
        {isOtMission ? 'OT 자료' : '학습 콘텐츠 확인하기'}
      </button>
      {isMenuShown && (
        <ul className="rounded absolute -bottom-1 w-full translate-y-full border border-[#BCBCBC] bg-white">
          {essentialContentsLink && (
            <li>
              <HybridLink
                href={essentialContentsLink}
                className="flex items-center justify-between px-5 py-3 text-center text-primary duration-200 hover:bg-gray-100"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>필수 콘텐츠</span>
                <i>
                  <IoIosLink />
                </i>
              </HybridLink>
            </li>
          )}
          {missionDetail.additionalContentsList.map((item) =>
            item.link ? (
              <li key={item.id}>
                <HybridLink
                  href={item.link}
                  className="flex w-full items-center justify-between px-4 py-3 text-primary hover:bg-gray-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{item.title}</span>
                  <i>
                    <IoIosLink />
                  </i>
                </HybridLink>
              </li>
            ) : null,
          )}
        </ul>
      )}
    </div>
  );
};

export default MenuContentsDropdown;
