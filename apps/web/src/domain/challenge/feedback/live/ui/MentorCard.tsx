'use client';
import { twMerge } from '@/lib/twMerge';
import type { Mentor } from '../types';

interface MentorCardProps {
  mentor: Mentor;
  onClick?: () => void;
  showStars?: boolean;
  className?: string;
}

const MentorCard = ({
  mentor,
  onClick,
  showStars = false,
  className,
}: MentorCardProps) => {
  const stars = Math.round(mentor.stars ?? 0);

  const cardClassName = twMerge(
    'rounded-xs flex w-full items-center gap-4 p-4 text-left transition-colors',
    onClick && 'cursor-pointer',
    className,
  );

  const content = (
    <>
      <div className="rounded-xs relative h-[119px] w-[119px] shrink-0 overflow-hidden">
        {mentor.thumbnailUrl && (
          <img
            src={mentor.thumbnailUrl}
            alt={mentor.name}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 flex flex-col gap-2 bg-black/70 p-[15px]">
          <span className="text-xxsmall16 text-bold leading-none text-neutral-100">
            {mentor.company}
          </span>
          <span className="text-xxsmall16 text-bold leading-none text-neutral-100">
            {mentor.name}
          </span>
        </div>
      </div>
      <div className="flex w-full flex-col gap-1 py-2">
        <p className="text-xsmall14 text-neutral-0 font-bold">{mentor.name}</p>
        {showStars && stars > 0 && (
          <div className="flex items-center gap-[1.5px]">
            {Array.from({ length: 5 }, (_, index) => (
              <img
                key={index}
                src={
                  index < stars
                    ? '/icons/star-yellow.svg'
                    : '/icons/star-unfill.svg'
                }
                alt=""
                className="h-3.5 w-3.5 shrink-0"
              />
            ))}
          </div>
        )}
        <p className="text-xxsmall12 text-neutral-30">{mentor.description}</p>
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
