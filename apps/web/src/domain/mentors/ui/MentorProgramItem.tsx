import Link from 'next/link';
import React from 'react';

import { twMerge } from '@/lib/twMerge';

export interface MentorProgramItemProps extends React.HTMLAttributes<HTMLDivElement> {
  thumbnail: string | null;
  title: string;
  url: string;
  duration?: string;
  deadlineLabel?: string;
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
        className="bg-primary-10 border-neutral-75 aspect-[1.3/1] w-full shrink-0 rounded-sm border-[0.7px] bg-cover bg-center"
        style={
          props.thumbnail
            ? { backgroundImage: `url(${props.thumbnail})` }
            : undefined
        }
      />

      <h3 className="text-xsmall16 text-neutral-0 md:text-small18 md:min-h-13 mt-2 line-clamp-2 min-h-12 flex-1 shrink-0 font-semibold md:mt-3">
        {props.title}
      </h3>

      {props.duration && (
        <div className="text-xxsmall10 md:text-xsmall14 mt-2 flex items-center gap-x-1.5 font-medium md:mt-4">
          <span className="text-neutral-0">진행기간</span>
          <span className="text-primary-dark">{props.duration}</span>
        </div>
      )}

      {props.deadlineLabel && (
        <div className="rounded-xxs text-xxsmall12 mt-2 w-fit bg-[#F2ECFC] px-2 py-1 font-semibold text-[#8444FF]">
          {props.deadlineLabel}
        </div>
      )}
    </Link>
  );
};

export default MentorProgramItem;
