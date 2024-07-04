import clsx from 'clsx';

import { useState } from 'react';
import { ApplicationType } from '../../../../../../pages/common/mypage/Application';
import ApplicationCardButton from '../../button/ApplicationCardButton';
import LinkButton from '../../button/LinkButton';
import PriceInfoModal from '../../modal/PriceInfoModal';
import DeleteMenu from '../menu/DeleteMenu';

interface ApplicationCardProps {
  application: ApplicationType;
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
  showDeleteMenu,
  refetch,
  showChallengeButton,
}: ApplicationCardProps) => {
  const [isPriceInfoOpen, setPriceInfoOpen] = useState({
    isOpen: false,
    paymentId: 0,
  });
  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2); // 두 자리 형식으로 연도 추출
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}.${month}.${day}`;
  };

  const checkChallengeStarted = (dateString: string) => {
    const date = new Date(dateString);
    const currentDate = new Date();
    return date < currentDate;
  }

  return (
    <div
      className={clsx(
        'flex w-full flex-col items-start gap-4 overflow-hidden rounded-xs md:flex-row md:border md:border-neutral-85 md:p-2.5',
      )}
    >
      <div
        className={clsx(
          'flex w-full flex-1 flex-col gap-2 md:flex-row md:gap-4',
          {
            grayscale: grayscale,
          },
        )}
      >
        <img
          src={application.programThumbnail}
          alt={'프로그렘 썸네일'}
          className="h-[7.5rem] w-full bg-primary-light object-cover md:h-[9rem] md:w-[11rem] md:rounded-xs"
        />
        <div className="flex flex-1 flex-col gap-2 py-2">
          {/* <div className="flex items-center justify-between">
            <span className="rounded-xs border border-primary bg-primary-20 px-2.5 py-0.5 text-xs font-medium text-primary-dark">
              모집 중
            </span>
            {showDeleteMenu && (
              <DeleteMenu
                className="hidden md:block"
                application={application}
              />
            )}
          </div> */}
          <div className="flex justify-between">
            <h2 className="font-semibold">{application.programTitle}</h2>
            {showDeleteMenu && (
              <DeleteMenu
                // className="md:block"
                application={application}
                refetch={refetch}
              />
            )}
          </div>
          <p className="text-sm text-neutral-30">
            {application.programShortDesc}
          </p>
          <div className="flex items-center gap-1.5 md:justify-end">
            <span className="text-xs text-neutral-0">진행기간</span>
            <span className="text-xs font-medium text-primary-dark">
              {formatDateString(application.programStartDate)} ~{' '}
              {formatDateString(application.programEndDate)}
            </span>
          </div>
        </div>
      </div>
      {application.status === 'WAITING' && (
        <ApplicationCardButton
          onClick={() => {
            setPriceInfoOpen({
              isOpen: true,
              paymentId: application.paymentId || 0,
            });
          }}
          className="payment_button"
        >
          결제 정보 확인
        </ApplicationCardButton>
      )}
      {application.programType === 'CHALLENGE' && showChallengeButton && checkChallengeStarted(application.programStartDate) && (
        <LinkButton
          to={`/challenge/${application.programId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          챌린지 대시보드
        </LinkButton>
      )}
      {hasReviewButton && (
        <LinkButton
          to={`/mypage/review/${
            reviewType === 'CREATE' ? 'new' : 'edit'
          }/program/${application.programType}/${application.programId}/${
            application.reviewId
              ? application.reviewId
              : `?application=${application.id}`
          }`}
          className={clsx(reviewType === 'CREATE' && 'review_button')}
        >
          {reviewType === 'CREATE' ? '후기 작성하기' : '수정하기'}
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
