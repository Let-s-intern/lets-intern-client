import Link from 'next/link';
import React from 'react';

import { twMerge } from '@/lib/twMerge';

export interface MentorProgramItemProps extends React.HTMLAttributes<HTMLDivElement> {
  thumbnail: string | null;
  title: string;
  url: string;
  duration?: string;
  deadlineLabel?: string;
  /** 썸네일 왼쪽 위 프로그램 종류 라벨. 예: LIVE, VOD */
  typeLabel?: string;
  gaTitle?: string;
}

const MentorProgramItem = ({ ...props }: MentorProgramItemProps) => {
  return (
    <Link
      className={twMerge(
        'relative flex w-full flex-1 shrink-0 flex-col',
        props.className,
      )}
      href={props.url}
      data-url={props.url}
      data-text={props.gaTitle}
    >
      <div
        className="relative aspect-[1.3/1] w-full shrink-0 rounded-sm border-[0.7px] border-neutral-75 bg-primary-10 bg-cover bg-center"
        style={
          props.thumbnail
            ? { backgroundImage: `url(${props.thumbnail})` }
            : undefined
        }
      >
        {props.typeLabel && (
          <span className="absolute left-1.5 top-1.5 rounded-xxs bg-neutral-0/80 px-2 py-0.5 text-xxsmall10 font-semibold text-static-100 md:text-xxsmall12">
            {props.typeLabel}
          </span>
        )}
      </div>

      <h3 className="md:min-h-13 mt-2 line-clamp-2 min-h-12 flex-1 shrink-0 text-xsmall16 font-semibold text-neutral-0 md:mt-3 md:text-small18">
        {props.title}
      </h3>

      {props.duration && (
        <div className="mt-2 flex items-center gap-x-1.5 text-xxsmall10 font-medium md:mt-4 md:text-xsmall14">
          <span className="text-neutral-0">진행기간</span>
          <span className="text-primary-dark">{props.duration}</span>
        </div>
      )}

      {props.deadlineLabel && (
        <div className="mt-2 w-fit rounded-xxs bg-[#F2ECFC] px-2 py-1 text-xxsmall12 font-semibold text-[#8444FF]">
          {props.deadlineLabel}
        </div>
      )}
    </Link>
  );
};

export default MentorProgramItem;
