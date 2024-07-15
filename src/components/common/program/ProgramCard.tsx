import { Dayjs } from 'dayjs';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

const ProgramCard = ({
  endDate,
  id,
  startDate,
  thumbnail,
  title,
  type,
  border = true,
  showLiveType,
  thumbnailClassName,
  thumbnailLinkClassName,
}: {
  type: 'challenge' | 'live';
  id: number;
  title: string;
  thumbnail: string;
  startDate: Dayjs;
  endDate: Dayjs;
  /** border 부분이 렌더링 될지 여부 */
  border?: boolean;
  /** 진행방식: Live 표기 여부 (챌린지일 경우 무시) */
  showLiveType?: boolean;
  thumbnailClassName?: string;
  thumbnailLinkClassName?: string;
}) => {
  const programLink = `/program/${type.toLowerCase()}/${id}`;

  return (
    <div
      className={twMerge(
        'flex w-full items-start gap-4 overflow-hidden',
        !border && 'rounded-xxs border-none p-0',
      )}
      data-program-text={title}
    >
      <Link
        to={programLink}
        className={twMerge(
          'flex transition hover:opacity-80',
          thumbnailLinkClassName,
        )}
      >
        <img
          src={thumbnail}
          alt={`${title} 썸네일`}
          className={twMerge(
            'min-h-[104px] min-w-[124px] object-cover',
            thumbnailClassName,
          )}
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex justify-between">
          <h2 className="break-keep text-xsmall16 font-semibold">
            <Link to={programLink} className="hover:underline">
              {title}
            </Link>
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-neutral-0">진행일정</span>
          <span className="text-xs font-medium text-primary-dark">
            {type === 'challenge'
              ? `${startDate.format('YY.MM.DD')} ~ ${endDate.format(
                  'YY.MM.DD',
                )}`
              : startDate.format('YY.MM.DD')}
          </span>
        </div>
        {type === 'live' && showLiveType ? (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-0">진행방식</span>
            <span className="text-xs font-medium text-primary-dark">
              라이브 클래스
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProgramCard;
