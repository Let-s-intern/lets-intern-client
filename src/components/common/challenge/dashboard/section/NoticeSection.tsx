import clsx from 'clsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  noticeList: any;
  isLoading: boolean;
}

const NoticeSection = ({ noticeList, isLoading }: Props) => {
  const [currentPageNum, setCurrentPageNum] = useState(1);

  const currentNoticeList = noticeList.slice(
    (currentPageNum - 1) * 4,
    currentPageNum * 4,
  );
  const totalPageCount =
    noticeList.length / 4 + (noticeList.length % 4 !== 0 ? 1 : 0);

  if (isLoading) {
    return <section className="mb-10">로딩 중...</section>;
  }

  return (
    <section className="flex w-[13rem] flex-col gap-4">
      <div className="flex flex-1 flex-col gap-2 rounded-xl border border-[#E4E4E7] p-6">
        <h2 className="font-semibold text-[#4A495C]">공지사항</h2>
        {currentNoticeList.length === 0 ? (
          <div className="flex h-[5.75rem] justify-center">
            <span className="mt-2 text-sm">공지사항이 없습니다.</span>
          </div>
        ) : (
          <ul className="flex flex-1 flex-col gap-1">
            {currentNoticeList.map((notice: any) => (
              <Link
                key={notice.id}
                to={notice.link}
                target="_blank"
                rel="noopenner noreferrer"
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
        <div className="mt-2 flex justify-center gap-2">
          {Array.from({ length: totalPageCount }, (_, index) => index + 1).map(
            (pageNum) => (
              <div
                key={pageNum}
                className={clsx('h-2 w-2 cursor-pointer rounded-full ', {
                  'bg-[#B0B0B0]': pageNum === currentPageNum,
                  'bg-[#D1D1D1]': pageNum !== currentPageNum,
                })}
                onClick={() => setCurrentPageNum(pageNum)}
              />
            ),
          )}
        </div>
      </div>
      <ul className="flex rounded-xl border border-[#E4E4E7]">
        <li className="flex flex-1">
          <Link
            to="https://www.youtube.com"
            className="flex h-16 w-16 flex-1 cursor-pointer items-center justify-center rounded-xl text-center text-sm transition-all duration-200 hover:bg-[#F0F0F0]"
            target="_blank"
            rel="noopenner noreferrer"
          >
            미션
            <br />
            수행법
          </Link>
        </li>
        <li className="flex flex-1">
          <Link
            to="https://www.naver.com"
            className="flex h-16 w-16 flex-1 cursor-pointer items-center justify-center rounded-xl text-center text-sm transition-all duration-200 hover:bg-[#F0F0F0]"
            target="_blank"
            rel="noopenner noreferrer"
          >
            환급
            <br />
            정책
          </Link>
        </li>
        <li className="flex flex-1">
          <Link
            to="https://www.google.com"
            className="flex h-16 w-16 flex-1 cursor-pointer items-center justify-center rounded-xl text-center text-sm transition-all duration-200 hover:bg-[#F0F0F0]"
            target="_blank"
            rel="noopenner noreferrer"
          >
            대시보드
            <br />
            설명서
          </Link>
        </li>
      </ul>
    </section>
  );
};

export default NoticeSection;
