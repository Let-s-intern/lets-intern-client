import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import React from 'react';

interface BadgeProps {
  text: string | undefined;
}

export interface ProgramItemProps extends React.HTMLAttributes<HTMLDivElement> {
  thumbnail: string;
  title: string;
  url: string;
  duration?: string;
  badge?: BadgeProps;
  createdDate?: string;
  category?: string;
  isDeadline?: boolean;
}

const ProgramItem = ({ ...props }: ProgramItemProps) => {
  return (
    <>
      <Link
        className={twMerge('relative flex w-full flex-col', props.className)}
        href={props.url}
        target={props.url.startsWith('http') ? '_blank' : undefined}
        data-url={props.url}
        data-text={props.title}
      >
        {props.isDeadline && (
          <span className="absolute left-2.5 top-2.5 rounded-xxs bg-neutral-10 px-1.5 py-[5px] text-xxsmall12 text-neutral-100">
            마감임박🔥
          </span>
        )}
        <img
          src={props.thumbnail}
          alt="thumbnail"
          className="aspect-[1.3/1] w-full rounded-sm object-cover"
        />
        {props.category && (
          <span className="-mb-1 mt-3 text-xsmall14 font-semibold text-primary">
            {props.category}
          </span>
        )}
        <h3 className="mt-2 line-clamp-2 text-xsmall16 font-semibold text-neutral-0 md:mt-3 md:text-small18">
          {props.title}
        </h3>
        {props.duration && (
          <div className="mt-2 flex items-center gap-x-1.5 text-xxsmall10 font-medium md:mt-4 md:text-xsmall14">
            <span className="text-neutral-0">진행기간</span>
            <span className="text-primary-dark">{props.duration}</span>
          </div>
        )}
        {props.badge && props.badge.text && (
          <div className="mt-3 flex w-fit rounded-xxs bg-[#F2ECFC] px-2 py-1 text-center text-xxsmall12 font-semibold text-[#8444FF] md:mt-4">
            {props.badge.text}
          </div>
        )}
        {props.createdDate && (
          <span className="mt-3 text-xxsmall12 text-neutral-40 md:mt-2">
            {props.createdDate}
          </span>
        )}
      </Link>
    </>
  );
};

export default ProgramItem;
