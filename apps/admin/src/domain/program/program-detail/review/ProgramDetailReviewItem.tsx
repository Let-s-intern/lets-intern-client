import StarIcon from '@/assets/icons/star.svg?react';
import { ContentReviewType } from '@/types/interface';

interface ProgramDetailReviewItemProps {
  type: 'challenge' | 'live';
  review: ContentReviewType;
  color: string;
  bgColor: string;
}
export const maskingName = (name: string) => {
  if (name === '익명') return name;
  if (name.length === 2) return name[0] + '*';
  if (name.length >= 3) {
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  }

  return '**';
};

const ProgramDetailReviewItem = ({
  type,
  review,
  color,
  bgColor,
}: ProgramDetailReviewItemProps) => {
  return (
    <div className="flex h-[340px] w-[300px] flex-col md:h-[366px] md:w-[371px]">
      {type !== 'live' && (
        <div
          className="line-clamp-2 flex w-full rounded-t-[10px] px-[22px] py-4 text-white md:text-small18"
          style={{ backgroundColor: color }}
        >
          {`${review.passedState} 합격`}
        </div>
      )}
      <div
        className={`flex h-[152px] w-full flex-col gap-y-3 rounded-b-[10px] border-[1.5px] border-neutral-85 bg-white px-[22px] pb-9 pt-7 md:h-[160px] ${type === 'live' ? 'rounded-t-[10px]' : ''}`}
      >
        <div
          className={`flex w-fit items-center rounded-xs px-2 py-1.5`}
          style={{ backgroundColor: bgColor }}
        >
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <StarIcon key={index} className={`h-4 w-4`} style={{ color }} />
            ))}
        </div>
        <p className="line-clamp-2 break-keep text-xsmall16 font-bold md:text-small20">
          {review.title}
        </p>
      </div>
      <div className="flex w-full grow flex-col gap-y-2 rounded-[10px] border-[1.5px] border-t-0 border-neutral-85 bg-white px-[22px] pt-7">
        <div className="flex w-full items-center gap-x-2">
          <span className="text-xsmall14 font-medium text-neutral-45 md:text-xsmall16">
            {maskingName(review.name)}
          </span>
          <p className="line-clamp-1 text-xsmall14 font-semibold text-neutral-30 md:text-xsmall16">{`${review.programName} 수강`}</p>
        </div>
        <p
          className={`${type === 'live' ? 'line-clamp-4' : 'line-clamp-2'} w-full break-words text-xsmall14 text-neutral-35 md:text-xsmall16`}
        >
          {review.content}
        </p>
      </div>
    </div>
  );
};

export default ProgramDetailReviewItem;
