import clsx from 'clsx';
import Button from '../button/Button';
import LinkButton from '../button/LinkButton';

interface ApplicationCardProps {
  hasReviewButton?: boolean;
  reviewButton?: {
    text: string;
  };
  grayscale?: boolean;
}

const ApplicationCard = ({
  hasReviewButton,
  reviewButton,
  grayscale,
}: ApplicationCardProps) => {
  return (
    <div
      className={clsx(
        'flex w-[11rem] flex-col items-start gap-4 overflow-hidden rounded-xs md:w-full md:flex-row md:border md:border-neutral-85 md:p-2.5',
      )}
    >
      <div
        className={clsx('flex flex-1 flex-col gap-2 md:flex-row md:gap-4', {
          grayscale: grayscale,
        })}
      >
        <div className="h-[7.5rem] w-[11rem] bg-primary-light md:h-[9rem] md:rounded-xs"></div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="rounded-xs border border-primary bg-primary-20 px-2.5 py-0.5 text-xs font-medium text-primary-dark">
              모집중
            </span>
          </div>
          <h2 className="font-semibold">인턴 지원 2주 챌린지</h2>
          <p className="text-sm text-neutral-30">
            2주동안 ~을 통해 경험정리 및 지원까지 한번에 최대글자수는
          </p>
          <div className="flex gap-1.5">
            <span className="text-xs text-neutral-0">진행기간</span>
            <span className="text-xs font-medium text-primary-dark">
              24.04.04 ~ 24.04.04
            </span>
          </div>
        </div>
      </div>
      {hasReviewButton && (
        <LinkButton to="/mypage/review/new/program/1">
          {reviewButton?.text}
        </LinkButton>
      )}
    </div>
  );
};

export default ApplicationCard;
