import ArrowCircle from '@/assets/icons/arrow-circle.svg?react';
import { ChallengeType, ProgramTypeUpperCase } from '@/schema';
import Link from 'next/link';

interface MoreReviewButtonProps {
  type: ProgramTypeUpperCase;
  mainColor: string;
  subColor: string;
  subTextColor?: string;
  challengeType?: ChallengeType;
  liveJob?: string;
}

const MoreReviewButton = ({
  mainColor,
  subColor,
  subTextColor = '#FFFFFF',
  type,
  challengeType,
  liveJob,
}: MoreReviewButtonProps) => {
  return (
    <>
      <Link
        className="more_reviews flex w-full items-center justify-center px-5 md:px-0"
        href={`/review/program?program=${type.toLowerCase()}_review${challengeType ? `&challenge=${challengeType.toLowerCase()}` : ''}${liveJob ? `&liveJob=${liveJob}` : ''}`}
        scroll
      >
        <div
          className="relative mt-12 flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-sm px-5 py-4 text-white md:mx-0 md:mt-20 md:w-fit"
          style={{ backgroundColor: mainColor }}
        >
          <span className="text-xsmall16 font-semibold md:text-medium22">
            더 다양한 후기 보러가기
          </span>
          <ArrowCircle className="h-6 w-6" />
          <div
            className="absolute bottom-[calc(100%-7px)] rounded-xs px-2.5 py-1.5 text-xxsmall12 font-medium md:text-xsmall14"
            style={{ backgroundColor: subColor, color: subTextColor }}
          >
            자세한 수강생들의 후기가 궁금하다면?
          </div>
        </div>
      </Link>
    </>
  );
};

export default MoreReviewButton;
