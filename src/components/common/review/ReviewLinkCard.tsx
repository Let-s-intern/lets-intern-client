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
  // blogReview: BlogReview;
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

  return (
    <Link
      href={url ?? ''}
      className="flex flex-col gap-3"
      target="_blank"
      rel="noreferrer noopener"
    >
      <div className="w-full h-[7rem] relative overflow-hidden bg-neutral-85 rounded-sm">
        <Image
          className="object-cover"
          src={thumbnail ?? ''}
          alt={title + ' 블로그 썸네일'}
          fill
          sizes="(min-width:768px) 13rem , 50vw"
        />
      </div>
      <div>
        {badgeType && programTitle ? (
          <div className="flex flex-col items-start gap-1 mb-2 md:flex-row md:items-center md:gap-2">
            <ReviewBadge type={badgeType} />
            <span className="block font-bold truncate text-xsmall14 text-primary">
              {programTitle}
            </span>
          </div>
        ) : null}
        <h3 className="h-12 mb-2 overflow-hidden font-bold text-xsmall16 line-clamp-2 text-neutral-0 text-ellipsis">
          {title}
        </h3>
        <p className="mb-4 overflow-hidden text-neutral-20 md:h-11 text-xsmall14 line-clamp-2 text-ellipsis">
          {description}
        </p>
        {externalLink || favicon ? (
          <div className="flex items-center mb-1">
            {/* TODO: 파비콘 추가 */}
            {favicon ? null : null}
            {externalLink ? (
              <span className="block truncate text-xsmall14 text-neutral-35">
                {externalLink}
              </span>
            ) : null}
          </div>
        ) : null}
        {date ? (
          <span className="text-neutral-40 text-xxsmall12">
            {dayjs(date).format(YYYY_MM_DD)} 작성
          </span>
        ) : null}
      </div>
    </Link>
  );
}

export default ReviewLinkCard;
