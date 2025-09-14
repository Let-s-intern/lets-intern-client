import { useReadGuides } from '@/hooks/useReadItems';
import { ChallengeGuide } from '@/schema';
import clsx from 'clsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import NoticeGuideLink from '../../NoticeGuideLink';

interface GuideSection {
  guides: ChallengeGuide[];
}

const GuideSection = ({ guides }: GuideSection) => {
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const { isNewItem, markAsRead } = useReadGuides();

  const currentGuideList = guides.slice(
    (currentPageNum - 1) * 3,
    currentPageNum * 3,
  );

  const totalPageCount = Math.ceil(guides.length / 3);

  const handleGuideClick = (guide: ChallengeGuide) => {
    if (isNewItem(guide.createDate, guide.id)) {
      markAsRead(guide.id);
    }
  };

  return (
    <section className="relative w-[calc((100%-12px)/2)] flex-1 flex-col rounded-xs border border-[#E4E4E7] p-4 md:h-40">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-neutral-10">챌린지 가이드</h2>
          <NoticeGuideLink />
        </div>
        {currentGuideList.length === 0 ? (
          <div className="flex h-[4.4rem] justify-center md:h-[5.75rem]">
            <span className="text-sm">챌린지 가이드가 없습니다.</span>
          </div>
        ) : (
          <ul className="flex flex-1 flex-col gap-1.5">
            {currentGuideList.map((guide) => (
              <Link
                key={guide.id}
                to={guide.link ?? ''}
                className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#333333] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleGuideClick(guide)}
              >
                <span className="truncate">{guide.title}</span>
                {isNewItem(guide.createDate, guide.id) && (
                  <img
                    src="/icons/badge_new.svg"
                    alt="new"
                    className="h-3 w-3"
                  />
                )}
              </Link>
            ))}
            {currentGuideList.length < 3 &&
              Array.from(
                { length: 3 - currentGuideList.length },
                (_, index) => index,
              ).map((index) => (
                <span
                  key={index}
                  className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#333333] opacity-0 hover:underline"
                >
                  placeholder
                </span>
              ))}
          </ul>
        )}
        {totalPageCount > 1 ? (
          <div className="flex justify-center gap-2">
            {Array.from(
              { length: totalPageCount },
              (_, index) => index + 1,
            ).map((pageNum) => (
              <button
                key={pageNum}
                className={clsx('h-1.5 w-1.5 cursor-pointer rounded-full', {
                  'bg-[#B0B0B0]': pageNum === currentPageNum,
                  'bg-[#D1D1D1]': pageNum !== currentPageNum,
                })}
                onClick={() => setCurrentPageNum(pageNum)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-2 flex justify-center gap-2" />
        )}
      </div>
    </section>
  );
};

export default GuideSection;
