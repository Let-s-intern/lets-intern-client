import { twMerge } from '@/lib/twMerge';
import { Dayjs } from 'dayjs';
import Link from 'next/link';

const ProgramCard = ({
  endDate,
  id,
  startDate,
  thumbnail,
  title,
  type,
  border = true,
  showType,
  thumbnailClassName,
  progressType,
  thumbnailLinkClassName,
}: {
  type: 'challenge' | 'live';
  id: number;
  title: string;
  thumbnail: string;
  startDate: Dayjs | null | undefined;
  endDate: Dayjs | null | undefined;
  /** border 부분이 렌더링 될지 여부 */
  border?: boolean;
  /** 진행방식 표기 여부 */
  showType?: boolean;
  progressType: string;
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
        href={programLink}
        className={twMerge(
          'flex transition hover:opacity-80',
          thumbnailLinkClassName,
        )}
        reloadDocument
      >
        <img
          src={thumbnail}
          alt={`${title} 썸네일`}
          className={twMerge(
            'min-h-[104px] min-w-[124px] rounded-sm object-cover',
            thumbnailClassName,
          )}
        />
      </Link>
      <div>
        <div className="flex justify-between">
          <h2 className="mb-3 break-keep text-xsmall16 font-semibold">
            <Link href={programLink} className="hover:underline">
              {title}
            </Link>
          </h2>
        </div>

        {startDate ? (
          <div className="mb-1 flex items-center gap-1.5">
            <span className="shrink-0 text-xs text-neutral-0">진행 기간</span>
            <span className="text-xs font-medium text-primary-dark">
              {type === 'challenge'
                ? `${startDate.format('YY.MM.DD')} ~ ${
                    endDate ? endDate.format('YY.MM.DD') : ''
                  }`
                : startDate.format('YY.MM.DD')}
            </span>
          </div>
        ) : null}

        {showType && progressType !== 'none' ? (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-0">진행 방식</span>
            <span className="text-xs font-medium text-primary-dark">
              {progressType === 'ALL'
                ? '온라인/오프라인'
                : progressType === 'ONLINE'
                  ? '온라인'
                  : '오프라인'}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProgramCard;
