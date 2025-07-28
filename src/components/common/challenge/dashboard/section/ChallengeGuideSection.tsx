import clsx from 'clsx';
import { useState } from 'react';
import { GrNext } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import { ChallengeGuide } from '../../../../../schema';

interface GuideSection {
  guides: ChallengeGuide[];
}

// 새로운 버전
const ChallengeGuideSection = ({ guides }: GuideSection) => {
  const [currentPageNum, setCurrentPageNum] = useState(1);

  const currentGuideList = guides.slice(
    (currentPageNum - 1) * 3,
    currentPageNum * 3,
  );
  const totalPageCount = Math.ceil(guides.length / 3);

  return (
    <section className="relative flex-1 flex-col rounded-xs border border-[#E4E4E7] p-4">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <h2 className="font-semibold text-neutral-10">챌린지 가이드</h2>
          <button>
            {/* 가이드 연결 필요 */}
            <GrNext className="text-sm text-neutral-45" />
          </button>
        </div>
        {currentGuideList.length === 0 ? (
          <div className="flex h-[5.75rem] justify-center">
            <span className="mt-2 text-sm">챌린지 가이드가 없습니다.</span>
          </div>
        ) : (
          <ul className="flex flex-1 flex-col gap-1.5">
            {currentGuideList.map((guide) => (
              <Link
                key={guide.id}
                to={guide.link ?? ''}
                className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#333333] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {guide.title}
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
                className={clsx('h-2 w-2 cursor-pointer rounded-full', {
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

export default ChallengeGuideSection;
