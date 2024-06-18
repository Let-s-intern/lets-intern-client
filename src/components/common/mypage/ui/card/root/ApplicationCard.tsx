import clsx from 'clsx';

import LinkButton from '../../button/LinkButton';
import DeleteMenu from '../menu/DeleteMenu';
import { ApplicationType } from '../../../../../../pages/common/mypage/Application';

interface ApplicationCardProps {
  application: ApplicationType;
  hasReviewButton?: boolean;
  reviewType?: 'CREATE' | 'EDIT';
  grayscale?: boolean;
  showDeleteMenu?: boolean;
}

const ApplicationCard = ({
  application,
  hasReviewButton,
  reviewType,
  grayscale,
  showDeleteMenu,
}: ApplicationCardProps) => {
  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2); // 두 자리 형식으로 연도 추출
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}.${month}.${day}`;
  };

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
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="rounded-xs border border-primary bg-primary-20 px-2.5 py-0.5 text-xs font-medium text-primary-dark">
              모집 중
            </span>
            {/* {showDeleteMenu && (
              <DeleteMenu
                className="hidden md:block"
                application={application}
              />
            )} */}
          </div>
          <div className="flex justify-between">
            <h2 className="font-semibold">{application.programTitle}</h2>
            {showDeleteMenu && (
              <DeleteMenu
                className="hidden md:block"
                application={application}
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
      {hasReviewButton && (
        <LinkButton
          to={`/mypage/review/${
            reviewType === 'CREATE' ? 'new' : 'edit'
          }/program/${application.programId}?application=${application.id}`}
        >
          {reviewType === 'CREATE' ? '후기 작성하기' : '수정하기'}
        </LinkButton>
      )}
    </div>
  );
};

export default ApplicationCard;
