'use client';
import { twMerge } from '@/lib/twMerge';
import type { Mentor } from '../types';

interface MentorCardProps {
  mentor: Mentor;
  onClick?: () => void;
  className?: string;
}

const MentorCard = ({ mentor, onClick, className }: MentorCardProps) => {
  const cardClassName = twMerge(
    'flex h-full w-full items-start gap-4 rounded-xs p-4 text-left transition-colors',
    onClick && 'cursor-pointer',
    className,
  );

  const content = (
    <>
      <div className="relative h-[119px] w-[119px] shrink-0 overflow-hidden rounded-xs">
        {mentor.profileImgUrl ? (
          <img
            src={mentor.profileImgUrl}
            alt={mentor.nickname}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-90">
            <img src="/icons/user.svg" alt="" className="h-14 w-14" />
          </div>
        )}
        {!!mentor.profileImgUrl && (
          <div className="absolute inset-0 flex items-end bg-black/70 p-[15px]">
            <span className="text-xxsmall16 text-bold leading-none text-neutral-100">
              {mentor.nickname}
            </span>
          </div>
        )}
      </div>
      <div className="flex w-full flex-col gap-4 py-2">
        <p className="text-xsmall14 font-bold text-neutral-0">
          {mentor.nickname}
        </p>
        <p className="line-clamp-4 whitespace-pre-line text-xxsmall12 text-neutral-30">
          {mentor.introduction}
        </p>
      </div>
    </>
  );

  if (!onClick) {
    return <div className={cardClassName}>{content}</div>;
  }

  return (
    <button type="button" onClick={onClick} className={cardClassName}>
      {content}
    </button>
  );
};

export default MentorCard;
