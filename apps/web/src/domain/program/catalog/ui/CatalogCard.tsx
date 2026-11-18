import type { ProgramCategoryTarget } from '@/api/program-category/programCategory';
import { getTargetHref } from '@/domain/career-journey/journeyNav';
import dayjs from '@/lib/dayjs';
import clsx from 'clsx';
import Link from 'next/link';
import ChallengeThumbnail from './ChallengeThumbnail';
import {
  CATALOG_TYPES,
  getCatalogTitle,
  getRecruitStatus,
  RecruitStatus,
} from '../catalogFilter';

const STATUS_LABEL: Record<RecruitStatus, string> = {
  OPEN: '모집 중',
  UPCOMING: '모집 예정',
  CLOSED: '모집 마감',
  ALWAYS: '즉시 수강 가능',
};

const typeLabel = (type: ProgramCategoryTarget['targetType']) =>
  CATALOG_TYPES.find((t) => t.key === type)?.label ?? '';

const formatPeriod = (target: ProgramCategoryTarget) => {
  if (!target.startDate) return null;
  const start = dayjs(target.startDate).format('YY.MM.DD');
  return target.endDate
    ? `${start} ~ ${dayjs(target.endDate).format('YY.MM.DD')}`
    : start;
};

/** 전체 프로그램 카드. 모든 유형을 한 모양으로 그린다 */
const CatalogCard = ({ target }: { target: ProgramCategoryTarget }) => {
  const status = getRecruitStatus(target);
  const period = target.targetType === 'MAGNET' ? null : formatPeriod(target);
  const statusLabel =
    status === 'ALWAYS' && target.targetType === 'LIVE_MENTORING'
      ? '상시 신청'
      : STATUS_LABEL[status];

  return (
    <Link
      href={getTargetHref(target.targetType, target.targetId, {
        title: target.title,
        mentorId: target.mentorId,
      })}
      className="program_catalog_card group flex flex-col gap-2"
      data-type={target.targetType}
      data-id={target.targetId}
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xs bg-neutral-95">
        {target.targetType === 'CHALLENGE' ? (
          <ChallengeThumbnail
            challengeType={target.challengeType}
            title={target.title}
            displayTitle={getCatalogTitle(target)}
            fallbackSrc={target.thumbnail}
          />
        ) : (
          target.thumbnail && (
            // 썸네일 출처가 여러 버킷이라 next/image 도메인 설정에 묶지 않는다
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={target.thumbnail}
              alt=""
              className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
            />
          )
        )}
      </div>
      <span className="text-xxsmall12 font-semibold text-primary">
        {typeLabel(target.targetType)}
      </span>
      <p className="line-clamp-2 text-xsmall16 font-semibold text-neutral-0">
        {getCatalogTitle(target)}
      </p>
      {period && (
        <p className="text-xxsmall12 text-neutral-30">
          진행기간 <span className="text-primary">{period}</span>
        </p>
      )}
      <span
        className={clsx(
          'w-fit rounded-xxs px-1.5 py-0.5 text-xxsmall12',
          status === 'CLOSED'
            ? 'bg-neutral-95 text-neutral-40'
            : 'bg-primary-5 text-primary',
        )}
      >
        {statusLabel}
      </span>
    </Link>
  );
};

export default CatalogCard;
