import clsx from 'clsx';
import { useState } from 'react';
import { GrNext } from 'react-icons/gr';
import { Link, useParams } from 'react-router-dom';
import { ChallengeNotice } from '../../../../../schema';

interface INoticeSectionProps {
  notices: ChallengeNotice[];
}
// 새로운 버전
const NoticeBoardSection = ({ notices }: INoticeSectionProps) => {
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const params = useParams();
  const applicationId = params.applicationId;

  const currentNoticeList = notices.slice(
    (currentPageNum - 1) * 4,
    currentPageNum * 4,
  );
  const totalPageCount = Math.ceil(notices.length / 4);

  return (
    <section className="flex w-full flex-col gap-4">
      <div className="flex flex-1 flex-col gap-3 rounded-xs border border-[#E4E4E7] p-4">
        <div className="flex justify-between">
          <h2 className="font-semibold text-neutral-10">공지사항</h2>
          <Link
            to={`/challenge/${params.programId}/dashboard/${applicationId}/guide`}
          >
            <GrNext className="text-sm text-neutral-45" />
          </Link>
        </div>
        {currentNoticeList.length === 0 ? (
          <div className="flex h-[5.75rem] justify-center">
            <span className="mt-2 text-sm">공지사항이 없습니다.</span>
          </div>
        ) : (
          <ul className="flex flex-1 flex-col gap-1.5">
            {currentNoticeList.map((notice) => (
              <Link
                key={notice.id}
                to={notice.link ?? ''}
                target="_blank"
                rel="noopener noreferrer"
                className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#333333] hover:underline"
              >
                {notice.title}
              </Link>
            ))}
            {currentNoticeList.length < 4 &&
              Array.from(
                { length: 4 - currentNoticeList.length },
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

export default NoticeBoardSection;
