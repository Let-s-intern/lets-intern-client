import StarIcon from '@/assets/icons/star.svg?react';
import { ReportReviewItem } from '@/types/interface';
import { maskingName } from '../program/program-detail/review/ProgramDetailReviewItem';

interface ReportReviewCardProps {
  review: ReportReviewItem;
  mainColor: string;
}

const ReportReviewCard = ({ review, mainColor }: ReportReviewCardProps) => {
  return (
    <div className="flex h-[280px] w-[90%] shrink-0 flex-col md:w-[370px]">
      <div
        className="flex w-full items-center rounded-t-[10px] px-[22px] py-3 text-xsmall16 font-semibold md:text-small18"
        style={{ backgroundColor: mainColor }}
      >
        <span>{`${review.company} ${review.isSuccessful ? '합격' : '지원'}`}</span>
      </div>
      <div className="flex w-full grow flex-col gap-y-5 rounded-b-[10px] bg-neutral-0/75 px-5 pb-7 pt-6 text-white">
        <div className="flex w-full grow flex-col gap-y-2">
          <div
            className={`flex w-fit shrink-0 items-center rounded-xs bg-white/5 px-2 py-1.5`}
          >
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <StarIcon
                  key={index}
                  className={`h-4 w-4`}
                  style={{ color: mainColor }}
                />
              ))}
          </div>
          <p className="whitespace-wrap line-clamp-4 w-full grow overflow-hidden text-ellipsis break-keep text-xsmall14 font-medium md:line-clamp-3 md:text-xsmall16">
            {review.content}
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-y-1">
          <span className="text-xsmall14 font-semibold md:text-xsmall16">{`${review.reportName} 이용자`}</span>
          <div className="flex items-center gap-x-2 text-xxsmall12 md:text-xsmall14">
            <span>{maskingName(review.name)}</span>
            <span>{`${review.job} 직무`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportReviewCard;
