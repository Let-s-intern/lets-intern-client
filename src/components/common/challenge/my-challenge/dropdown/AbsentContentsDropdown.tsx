import { UserChallengeMissionDetail } from '@/schema';
import { useState } from 'react';
import { IoIosLink } from 'react-icons/io';
import { Link } from 'react-router-dom';

interface Props {
  missionDetail: UserChallengeMissionDetail;
}

const AbsentContentsDropdown = ({ missionDetail }: Props) => {
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
          {missionDetail.additionalContentsList.map((item) =>
            item.link ? (
              <li key={item.id}>
                <Link
                  to={item.link}
                  className="flex w-full items-center justify-between px-4 py-3 text-primary hover:bg-gray-200"
                  target="_blank"
                  rel="noopenner noreferrer"
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

export default AbsentContentsDropdown;
