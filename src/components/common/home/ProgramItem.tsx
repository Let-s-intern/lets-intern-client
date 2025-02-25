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
}

const ProgramItem = ({ ...props }: ProgramItemProps) => {
  return (
    <>
      <Link
        className="flex w-full flex-col"
        href={props.url}
        target={props.url.startsWith('http') ? '_blank' : undefined}
      >
        <img
          src={props.thumbnail}
          alt="thumbnail"
          className="aspect-[3/2] w-full rounded-sm object-cover"
        />
        <h3 className="mt-2 line-clamp-2 text-xsmall16 font-semibold text-neutral-0 md:mt-3 md:text-small18 md:font-bold">
          {props.title}
        </h3>
        {props.duration && (
          <div className="text-xxsmall10 mt-2 flex items-center gap-x-1.5 font-medium md:mt-4 md:text-xsmall14">
            <span className="text-neutral-0">진행기간</span>
            <span className="text-primary-dark">{props.duration}</span>
          </div>
        )}
        {props.badge && props.badge.text && (
          <div className="mt-3 flex w-fit rounded-xxs bg-[#F2ECFC] px-2 py-1 text-center text-xxsmall12 font-semibold text-[#8444FF] md:mt-4">
            {props.badge.text}
          </div>
        )}
      </Link>
    </>
  );
};

export default ProgramItem;
