import { MypageApplication } from '@/api/application';
import dayjs from '@/lib/dayjs';
import { getReportThumbnail } from '@components/common/mypage/credit/CreditListItem';
import clsx from 'clsx';
import { useState } from 'react';
import HybridLink from '../../../ui/HybridLink';
import LinkButton from '../../button/LinkButton';
import PriceInfoModal from '../../modal/PriceInfoModal';

interface ApplicationCardProps {
  application: MypageApplication;
  hasReviewButton?: boolean;
  reviewType?: 'CREATE' | 'EDIT';
  grayscale?: boolean;
  showDeleteMenu?: boolean;
  refetch?: () => void;
  showChallengeButton?: boolean;
}

const ApplicationCard = ({
  application,
  hasReviewButton,
  reviewType,
  grayscale,
  showChallengeButton,
}: ApplicationCardProps) => {
  const [isPriceInfoOpen, setPriceInfoOpen] = useState({
    isOpen: false,
    paymentId: 0,
  });

  const thumbnail =
    application.programType === 'REPORT' && application.reportType
      ? getReportThumbnail(application.reportType)
      : (application.programThumbnail ?? '');

  const programLink =
    application.programType === 'REPORT'
      ? '/report/management'
      : `/program/${application.programType?.toLowerCase()}/${application.programId}`;

  return (
    <div
      className="flex h-[282px] w-full flex-col items-start gap-4 overflow-hidden rounded-xs md:h-full md:flex-row md:border md:border-neutral-85 md:p-2.5"
      data-program-text={application.programTitle}
    >
      <div
        className={clsx('flex w-full flex-col gap-2 md:flex-row md:gap-4', {
          grayscale,
        })}
      >
        <HybridLink
          href={programLink}
          className="flex-shrink-0 md:w-[11rem]"
        >
          <img
            src={thumbnail}
            alt="프로그램 썸네일"
            className="h-[7.5rem] w-full bg-primary-light object-cover md:h-[9rem] md:w-[11rem] md:rounded-xs"
          />
        </HybridLink>
        <div className="flex flex-col justify-between gap-2 py-2">
          <div className="flex w-full flex-col gap-y-0.5">
            <h2 className="font-semibold">
              <HybridLink
                href={programLink}
                className="hover:underline"
              >
                {application.programTitle}
              </HybridLink>
            </h2>
            <p className="line-clamp-2 h-10 text-sm text-neutral-30 md:line-clamp-none md:h-auto">
              {application.programShortDesc}
            </p>
          </div>
          <div className="flex items-center gap-1.5 md:justify-start">
            <span className="text-xs text-neutral-0">
              {application.programType === 'REPORT' ? '신청일자' : '진행기간'}
            </span>
            <span className="text-xs font-medium text-primary-dark">
              {application.programType === 'REPORT'
                ? application.createDate?.format('YY.MM.DD')
                : `${application.programStartDate?.format('YY.MM.DD')} ~ ${application.programEndDate?.format('YY.MM.DD')}`}
            </span>
          </div>
        </div>
      </div>
      {application.programType === 'CHALLENGE' &&
        showChallengeButton &&
        application.programStartDate?.isBefore(dayjs()) && (
          <LinkButton
            to={`/challenge/${application.id}/${application.programId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap"
          >
            챌린지 대시보드
          </LinkButton>
        )}
      {hasReviewButton && (
        <LinkButton
          to={`/mypage/review/${
            reviewType === 'CREATE' ? 'new/' : ''
          }${application.programType?.toLowerCase()}/${application.programId}${
            application.reviewId
              ? `?reviewId=${application.reviewId}`
              : `?application=${application.id}`
          }`}
          className={`${clsx(reviewType === 'CREATE' && 'review_button')} whitespace-nowrap`}
        >
          {reviewType === 'CREATE' ? '후기 작성하기' : '후기 확인하기'}
        </LinkButton>
      )}
      {isPriceInfoOpen.isOpen && (
        <PriceInfoModal
          paymentId={isPriceInfoOpen.paymentId}
          onClose={() => setPriceInfoOpen({ isOpen: false, paymentId: 0 })}
        />
      )}
    </div>
  );
};

export default ApplicationCard;
