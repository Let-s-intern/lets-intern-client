'use client';

import Image from 'next/image';
import Link from 'next/link';

import { YYYY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { ProgramTypeUpperCase } from '@/schema';
import ReviewBadge, {
  getBadgeTypeFromProgramType,
} from '@components/ReviewBadge';

interface IReviewLinkCardProps {
  url?: string | null;
  thumbnail?: string | null;
  title?: string | null;
  description?: string | null;
  programType?: ProgramTypeUpperCase | null;
  programTitle?: string | null;
  externalLink?: string | null;
  favicon?: string | null;
  date?: string | null;
}

function ReviewLinkCard({
  date,
  description,
  externalLink,
  favicon,
  programTitle,
  programType,
  thumbnail,
  title,
  url,
}: IReviewLinkCardProps) {
  const badgeType = programType
    ? getBadgeTypeFromProgramType(programType)
    : null;
  const isInternal = url?.startsWith('/');

  return (
    <div className="group relative flex flex-col gap-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          className="rounded-sm object-cover transition group-has-[a:hover]:opacity-80"
          src={thumbnail ?? ''}
          alt={title + ' 블로그 썸네일'}
          fill
          sizes="(min-width:768px) 13rem , 50vw"
        />
      </div>
      <div>
        <div className="mb-2 flex flex-col items-start gap-1">
          {badgeType ? <ReviewBadge type={badgeType} /> : null}

          {programTitle ? (
            <span className="block max-w-full truncate text-xsmall14 font-bold text-primary">
              {programTitle}
            </span>
          ) : null}
        </div>

        <h3 className="mb-2 line-clamp-2 h-12 overflow-hidden text-ellipsis text-xsmall16 font-bold text-neutral-0">
          <Link
            href={url ?? ''}
            {...(!isInternal
              ? {
                  target: '_blank',
                  rel: 'noreferrer noopener',
                }
              : {})}
            className="transition hover:text-neutral-30"
          >
            {title}
            {/* ring-1 ring-inset ring-gray-200 hover:ring-gray-400 */}
            <span className="absolute inset-0 rounded-md transition"></span>
          </Link>
        </h3>
        <p className="mb-4 line-clamp-2 overflow-hidden text-ellipsis text-xsmall14 text-neutral-20">
          {description}
        </p>
        {externalLink || favicon ? (
          <div className="mb-1 flex items-center gap-2">
            {/* TODO: 파비콘 추가 */}
            {favicon && (
              <img className="h-5 w-5" src={favicon} alt={title + ' 파비콘'} />
            )}
            {externalLink ? (
              <span className="block truncate text-xsmall14 text-neutral-35">
                {externalLink}
              </span>
            ) : null}
          </div>
        ) : null}
        {date ? (
          <span className="text-xxsmall12 text-neutral-40">
            {dayjs(date).format(YYYY_MM_DD)} 작성
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default ReviewLinkCard;
