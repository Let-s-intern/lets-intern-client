// 공지 아코디언 항목. 제목(말줄임) + N뱃지(상위 2개) + chevron, 펼침은 grid-rows 애니메이션.
'use client';

import HybridLink from '@/common/HybridLink';
import clsx from 'clsx';
import { useState } from 'react';
import type { AllInOnePassNotice } from '../../types';

const NewDot = () => (
  <span className="bg-system-error ml-1 inline-flex h-3 w-3 items-center justify-center rounded-full align-middle text-[8px] font-bold leading-none text-white">
    N
  </span>
);

// 평문 속 URL을 파란 밑줄 링크(새 탭)로 변환
const URL_REGEX = /(https?:\/\/[^\s]+)/g;
const renderWithLinks = (text: string) =>
  text.split(URL_REGEX).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <HybridLink
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary break-all font-medium underline"
      >
        {part}
      </HybridLink>
    ) : (
      part
    ),
  );

interface Props {
  notice: AllInOnePassNotice;
  isNew?: boolean;
}

const NoticeItem = ({ notice, isNew }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-neutral-80 border-b">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-start gap-2 p-3 text-left md:items-center md:p-4"
      >
        <h3 className="text-xsmall16 md:text-small18 text-neutral-0 line-clamp-2 min-w-0 flex-1 md:line-clamp-1">
          {notice.title}
          {isNew && <NewDot />}
        </h3>

        <img
          src="/icons/Caret_Down_MD-dark.svg"
          alt=""
          className={clsx(
            'shrink-0 transition-transform duration-300',
            open && 'rotate-180',
          )}
        />
      </button>

      <div
        className={clsx(
          'grid transition-[grid-template-rows] duration-300 ease-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div className="bg-neutral-95 text-xxsmall12 md:text-xsmall16 text-neutral-30 mb-3 max-h-[60vh] overflow-y-auto whitespace-pre-wrap rounded-sm p-3 font-light md:mb-4 md:max-h-none md:overflow-y-visible md:rounded-md md:p-8">
            {renderWithLinks(notice.contents)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeItem;
