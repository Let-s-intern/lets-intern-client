import { UserChallengeMissionDetail } from '@/schema';
import { useState } from 'react';
import { IoIosLink } from 'react-icons/io';
import HybridLink from '../../../../common/HybridLink';

interface Props {
  missionDetail: UserChallengeMissionDetail;
}

const ContentsDropdown = ({ missionDetail }: Props) => {
  const [isMenuShown, setIsMenuShown] = useState(false);
  const additionalContentsLink =
    missionDetail.additionalContentsList?.[0]?.link;
  const essentialContentsLink = missionDetail.essentialContentsList?.[0]?.link;

  const isOtMission = missionDetail.th === 0;

  return (
    <div className="relative z-10 flex-1">
      <div
        className="bg-primary-20 text-xsmall16 text-primary cursor-pointer rounded-sm p-3 text-center font-medium"
        onClick={() => setIsMenuShown(!isMenuShown)}
      >
        {isOtMission ? 'OT 자료' : '학습 콘텐츠'}
      </div>
      {isMenuShown && (essentialContentsLink || additionalContentsLink) && (
        <ul className="absolute bottom-[-0.25rem] w-full translate-y-[100%] rounded border border-[#DCDCDC] bg-white text-sm">
          {essentialContentsLink && (
            <li>
              <HybridLink
                href={essentialContentsLink}
                className="text-primary flex w-full items-center justify-between px-4 py-3 hover:bg-gray-200"
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
                  className="text-primary flex w-full items-center justify-between px-4 py-3 hover:bg-gray-200"
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

export default ContentsDropdown;
