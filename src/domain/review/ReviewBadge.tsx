import { ReviewType } from '@/api/review';
import { twMerge } from '@/lib/twMerge';
import { ProgramTypeUpperCase } from '@/schema';

export type ReviewBadgeType = ReviewType | 'CHALLENGE_SIMPLE';

export const getBadgeTypeFromProgramType = (
  programType: ProgramTypeUpperCase,
): ReviewBadgeType => {
  switch (programType) {
    case 'CHALLENGE':
      return 'CHALLENGE_SIMPLE';
    case 'LIVE':
      return 'LIVE_REVIEW';
    case 'VOD':
      return 'VOD_REVIEW';
    case 'REPORT':
      return 'REPORT_REVIEW';
  }
};

const ReviewBadge = ({
  type,
  className,
}: {
  type: ReviewBadgeType;
  className?: string;
}) => {
  switch (type) {
    case 'CHALLENGE_SIMPLE':
      return (
        <span
          className={twMerge(
            'inline-flex items-center gap-1 whitespace-pre rounded-xxs bg-primary-10 px-2 py-1 text-xsmall14 font-bold text-primary',
            className,
          )}
        >
          {/* <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.2302 16.8747C16.1264 17.4939 14.1081 16.2277 12.155 13.8848C12.7735 15.7755 12.7516 17.2842 11.9646 17.7256C11.0776 18.2232 9.46794 17.225 7.92112 15.3718C8.16276 16.5508 7.98533 17.5049 7.35513 17.8584C6.30932 18.445 4.41266 17.1555 3.11882 14.9782C1.82497 12.8009 1.62389 10.5602 2.6697 9.97357C3.29989 9.62006 4.23904 9.94782 5.16907 10.7406C4.29057 8.51238 4.20563 6.65881 5.09266 6.16123C5.87962 5.71978 7.23539 6.45569 8.61143 7.92148C7.49963 5.10677 7.38023 2.77552 8.48409 2.15631C9.97809 1.31826 13.1471 3.93369 15.5623 7.99805C17.9775 12.0624 18.7242 16.0366 17.2302 16.8747Z"
              fill={fill ?? '#4D55F5'}
            />
          </svg> */}
          <span>챌린지</span>
        </span>
      );

    case 'CHALLENGE_REVIEW':
      return (
        // TODO: 색상 토크나이징
        <span
          className={twMerge(
            'inline-flex items-center gap-1 whitespace-pre rounded-xxs bg-[#FFF2E4] px-2 py-1 text-xsmall14 font-bold text-[#FF9C34]',
            className,
          )}
        >
          {/* <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.2302 16.8747C16.1264 17.4939 14.1081 16.2277 12.155 13.8848C12.7735 15.7755 12.7516 17.2842 11.9646 17.7256C11.0776 18.2232 9.46794 17.225 7.92112 15.3718C8.16276 16.5508 7.98533 17.5049 7.35513 17.8584C6.30932 18.445 4.41266 17.1555 3.11882 14.9782C1.82497 12.8009 1.62389 10.5602 2.6697 9.97357C3.29989 9.62006 4.23904 9.94782 5.16907 10.7406C4.29057 8.51238 4.20563 6.65881 5.09266 6.16123C5.87962 5.71978 7.23539 6.45569 8.61143 7.92148C7.49963 5.10677 7.38023 2.77552 8.48409 2.15631C9.97809 1.31826 13.1471 3.93369 15.5623 7.99805C17.9775 12.0624 18.7242 16.0366 17.2302 16.8747Z"
              fill={fill ?? '#FF9C34'}
            />
          </svg> */}
          <span>챌린지</span>
          <span className="text-xxsmall12 font-semibold">
            프로그램 참여 후기
          </span>
        </span>
      );
    case 'LIVE_REVIEW':
      return (
        <span
          className={twMerge(
            'inline-flex items-center gap-1 whitespace-pre rounded-xxs bg-[#F9EEFF] px-2 py-1 text-xsmall14 font-bold text-tertiary',
            className,
          )}
        >
          {/* <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.95312 6C2.40084 6 1.95312 6.44772 1.95312 7V18.0018C1.95312 18.5541 2.40084 19.0018 2.95312 19.0018H16.3189C16.8712 19.0018 17.3189 18.5541 17.3189 18.0018V14.6835L21.4252 17.4066C21.6911 17.583 22.0463 17.3923 22.0463 17.0733V7.86811C22.0463 7.56139 21.7152 7.36879 21.4486 7.52037L17.3189 9.86775V7C17.3189 6.44772 16.8712 6 16.3189 6H2.95312Z"
              fill={fill ?? '#CB81F2'}
            />
          </svg> */}
          LIVE 클래스
        </span>
      );

    // TODO: 사용 안 함
    case 'VOD_REVIEW':
      return (
        <span
          className={twMerge(
            'inline-flex items-center gap-1 whitespace-pre rounded-xxs px-2 py-1 text-xsmall14 font-bold',
            className,
          )}
        >
          {/* <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.95312 6C2.40084 6 1.95312 6.44772 1.95312 7V18.0018C1.95312 18.5541 2.40084 19.0018 2.95312 19.0018H16.3189C16.8712 19.0018 17.3189 18.5541 17.3189 18.0018V14.6835L21.4252 17.4066C21.6911 17.583 22.0463 17.3923 22.0463 17.0733V7.86811C22.0463 7.56139 21.7152 7.36879 21.4486 7.52037L17.3189 9.86775V7C17.3189 6.44772 16.8712 6 16.3189 6H2.95312Z"
              fill={fill ?? '#CB81F2'}
            />
          </svg> */}
          VOD
        </span>
      );
    case 'REPORT_REVIEW':
      return (
        <span
          className={twMerge(
            'inline-flex items-center gap-1 whitespace-pre rounded-xxs bg-secondary-10 px-2 py-1 text-xsmall14 font-bold text-secondary',
            className,
          )}
        >
          {/* <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.5625 4H4.4375C4.19588 4 4 4.19588 4 4.4375V18.5625C4 18.8041 4.19588 19 4.4375 19H13.1938C13.3098 19 13.4211 18.9539 13.5031 18.8719L18.8719 13.5031C18.9539 13.4211 19 13.3098 19 13.1938V4.4375C19 4.19588 18.8041 4 18.5625 4Z"
              fill="#1BC47D"
            />
            <path
              d="M13.55 13.375H18.5775C18.7334 13.375 18.8115 13.5635 18.7013 13.6737L13.6737 18.7013C13.5635 18.8115 13.375 18.7334 13.375 18.5775V13.55C13.375 13.4534 13.4534 13.375 13.55 13.375Z"
              fill={fill ?? '#009C89'}
            />
          </svg> */}
          <span>서류 피드백 REPORT</span>
        </span>
      );
    case 'MISSION_REVIEW':
      return (
        <span
          className={twMerge(
            'inline-flex items-center gap-1 whitespace-pre rounded-xxs bg-primary-10 px-2 py-1 text-xsmall14 font-bold text-primary',
            className,
          )}
        >
          {/* <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.2302 16.8747C16.1264 17.4939 14.1081 16.2277 12.155 13.8848C12.7735 15.7755 12.7516 17.2842 11.9646 17.7256C11.0776 18.2232 9.46794 17.225 7.92112 15.3718C8.16276 16.5508 7.98533 17.5049 7.35513 17.8584C6.30932 18.445 4.41266 17.1555 3.11882 14.9782C1.82497 12.8009 1.62389 10.5602 2.6697 9.97357C3.29989 9.62006 4.23904 9.94782 5.16907 10.7406C4.29057 8.51238 4.20563 6.65881 5.09266 6.16123C5.87962 5.71978 7.23539 6.45569 8.61143 7.92148C7.49963 5.10677 7.38023 2.77552 8.48409 2.15631C9.97809 1.31826 13.1471 3.93369 15.5623 7.99805C17.9775 12.0624 18.7242 16.0366 17.2302 16.8747Z"
              fill={fill ?? '#4D55F5'}
            />
          </svg> */}
          <span>챌린지</span>
          <span className="text-xxsmall12 font-semibold">미션 수행 후기</span>
        </span>
      );
  }
};

export default ReviewBadge;
