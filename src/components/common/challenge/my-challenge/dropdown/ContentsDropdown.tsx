import { UserChallengeMissionDetail } from '@/schema';
import { useState } from 'react';
import { IoIosLink } from 'react-icons/io';
import { Link } from 'react-router-dom';

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
        className="cursor-pointer rounded-sm bg-primary-20 p-3 text-center text-xsmall16 font-medium text-primary"
        onClick={() => setIsMenuShown(!isMenuShown)}
      >
        {isOtMission ? 'OT 자료' : '학습 콘텐츠'}
      </div>
      {isMenuShown && (essentialContentsLink || additionalContentsLink) && (
        <ul className="rounded absolute bottom-[-0.25rem] w-full translate-y-[100%] border border-[#DCDCDC] bg-white text-sm">
          {essentialContentsLink && (
            <li>
              <Link
                to={essentialContentsLink}
                className="flex w-full items-center justify-between px-4 py-3 text-primary hover:bg-gray-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>필수 콘텐츠</span>
                <i>
                  <IoIosLink />
                </i>
              </Link>
            </li>
          )}
          {missionDetail.additionalContentsList.map((item) =>
            item.link ? (
              <li key={item.id}>
                <Link
                  to={item.link}
                  className="flex w-full items-center justify-between px-4 py-3 text-primary hover:bg-gray-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{item.title}</span>
                  <i>
                    <IoIosLink />
                  </i>
                </Link>
              </li>
            ) : null,
          )}
        </ul>
      )}
    </div>
  );
};

export default ContentsDropdown;
