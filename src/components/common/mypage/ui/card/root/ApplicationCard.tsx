import clsx from 'clsx';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ApplicationType } from '../../../../../../pages/common/mypage/Application';
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
  };

  const programLink = `/program/${application.programType.toLowerCase()}/${application.programId}`;

  return (
    <div
      className={clsx(
        'flex w-full flex-col items-start gap-4 overflow-hidden rounded-xs md:flex-row md:border md:border-neutral-85 md:p-2.5',
      )}
      data-program-text={application.programTitle}
    >
      <div
        className={clsx(
          'flex w-full flex-1 flex-col gap-2 md:flex-row md:gap-4',
          {
            grayscale: grayscale,
          },
        )}
      >
        <Link to={programLink}>
          <img
            src={application.programThumbnail}
            alt="프로그램 썸네일"
            className="h-[7.5rem] w-full bg-primary-light object-cover md:h-[9rem] md:w-[11rem] md:rounded-xs"
          />
        </Link>
        <div className="flex flex-1 flex-col justify-between gap-2 py-2">
          <div className="flex justify-between">
            <h2 className="font-semibold">
              <Link to={programLink} className="hover:underline">
                {application.programTitle}
              </Link>
            </h2>
            {showDeleteMenu && (
              <DeleteMenu application={application} refetch={refetch} />
            )}
          </div>
          <p className="text-sm text-neutral-30">
            {application.programShortDesc}
          </p>
          <div className="flex items-center gap-1.5 md:justify-start">
            <span className="text-xs text-neutral-0">진행기간</span>
            <span className="text-xs font-medium text-primary-dark">
              {formatDateString(application.programStartDate)} ~{' '}
              {formatDateString(application.programEndDate)}
            </span>
          </div>
        </div>
      </div>
      {application.programType === 'CHALLENGE' &&
        showChallengeButton &&
        checkChallengeStarted(application.programStartDate) && (
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
