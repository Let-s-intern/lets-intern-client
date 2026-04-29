import { twMerge } from '@/lib/twMerge';
import { Link } from 'react-router-dom';
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
  gaTitle?: string;
}

const ProgramItem = ({ ...props }: ProgramItemProps) => {
  return (
    <>
      <Link
        className={twMerge('relative flex w-full flex-col', props.className)}
        to={props.url}
        target={props.url.startsWith('http') ? '_blank' : undefined}
        data-url={props.url}
        data-text={props.gaTitle}
      >
        {props.isDeadline && (
          <span className="rounded-xxs bg-neutral-10 text-xxsmall12 absolute left-2 top-2 p-1 text-[0.6875rem] font-medium text-neutral-100 md:left-2.5 md:top-2.5 md:px-1.5 md:py-[5px]">
            마감임박🔥
          </span>
        )}
        <img
          src={props.thumbnail || undefined}
          alt="thumbnail"
          className="border-neutral-75 aspect-[1.3/1] w-full rounded-sm border-[0.7px] object-cover"
        />
        {props.category && (
          <span className="text-xsmall14 text-primary -mb-1 mt-3 font-semibold">
            {props.category}
          </span>
        )}
        <h3 className="text-xsmall16 text-neutral-0 md:text-small18 mt-2 line-clamp-2 font-semibold md:mt-3">
          {props.title}
        </h3>
        {props.duration && (
          <div className="text-xxsmall10 md:text-xsmall14 mt-2 flex items-center gap-x-1.5 font-medium md:mt-4">
            <span className="text-neutral-0">진행기간</span>
            <span className="text-primary-dark">{props.duration}</span>
          </div>
        )}
        {props.badge && props.badge.text && (
          <div className="rounded-xxs text-xxsmall12 mt-3 flex w-fit bg-[#F2ECFC] px-2 py-1 text-center font-semibold text-[#8444FF] md:mt-4">
            {props.badge.text}
          </div>
        )}
        {props.createdDate && (
          <span className="text-xxsmall12 text-neutral-40 mt-3 md:mt-2">
            {props.createdDate}
          </span>
        )}
      </Link>
    </>
  );
};

export default ProgramItem;
