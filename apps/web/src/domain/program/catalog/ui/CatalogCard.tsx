import type { ProgramCategoryTarget } from '@/api/program-category/programCategory';
import { getTargetHref } from '@/domain/career-journey/journeyNav';
import {
  cardPriceLabel,
  durationsLabel,
} from '@/domain/live-mentoring/constants';
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

/** 멘토링 썸네일이 없을 때 쓰는 배경. 상품 번호로 정해 같은 카드는 늘 같은 색이다 */
const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #FF6A1A 0%, #FF9A4D 100%)',
  'linear-gradient(135deg, #4D55F5 0%, #7B82FF 100%)',
  'linear-gradient(135deg, #1DB36B 0%, #4FD39A 100%)',
  'linear-gradient(135deg, #13A6E0 0%, #52CBF6 100%)',
  'linear-gradient(135deg, #2B2F8F 0%, #4D55F5 100%)',
];

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
const CatalogCard = ({
  target,
  recommended = false,
}: {
  target: ProgramCategoryTarget;
  /** AI 가 추천한 상품이면 배지를 단다 */
  recommended?: boolean;
}) => {
  const status = getRecruitStatus(target);
  const period = target.targetType === 'MAGNET' ? null : formatPeriod(target);
  const isMentoring = target.targetType === 'LIVE_MENTORING';
  const statusLabel =
    status === 'ALWAYS' && isMentoring ? '상시 신청' : STATUS_LABEL[status];
  // 멘토링은 진행기간 대신 진행 시간·최저가를 같은 줄에 보인다
  const mentoringDurations = (target.durations ?? []) as Parameters<
    typeof durationsLabel
  >[0];
  const mentoringMeta = isMentoring
    ? [
        mentoringDurations.length > 0
          ? durationsLabel(mentoringDurations)
          : null,
        target.price != null
          ? cardPriceLabel(mentoringDurations, target.price)
          : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : null;
  const mentorBadge = isMentoring
    ? [target.mentorCompany, target.mentorJob].filter(Boolean).join(' · ')
    : '';

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
      <div
        className={clsx(
          'relative aspect-[4/3] w-full overflow-hidden rounded-xs',
          // 멘토링은 이미지가 없으면 멘토링 목록처럼 브랜드색 면 위에 제목을 얹는다
          isMentoring && !target.thumbnail ? '' : 'bg-neutral-95',
        )}
        style={
          isMentoring && !target.thumbnail
            ? {
                background:
                  FALLBACK_GRADIENTS[
                    target.targetId % FALLBACK_GRADIENTS.length
                  ],
              }
            : undefined
        }
      >
        {recommended && (
          <span className="absolute right-2 top-2 z-10 rounded-xxs bg-primary px-2 py-0.5 text-xxsmall12 font-semibold text-white">
            AI 추천
          </span>
        )}
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
        {isMentoring && !target.thumbnail && (
          <>
            {/* 뒤에 깔리는 연한 로고. 글자 읽기를 방해하지 않게 흰색으로 아주 옅게 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo/logo-simple.svg"
              alt=""
              aria-hidden
              className="pointer-events-none absolute -bottom-6 -right-6 w-[58%] opacity-[0.14] brightness-0 invert"
            />
            <div
              className={clsx(
                'relative flex h-full min-h-0 flex-col justify-center overflow-hidden px-4 pb-4 md:px-5 md:pb-5',
                mentorBadge ? 'pt-11' : 'pt-4',
              )}
            >
              <p className="line-clamp-3 break-keep text-small18 font-bold leading-snug text-white">
                {target.title}
              </p>
              {mentoringMeta && (
                <p className="mt-2 text-xxsmall12 text-white/80">
                  {mentoringMeta}
                </p>
              )}
            </div>
          </>
        )}
        {mentorBadge && (
          <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-xs bg-neutral-0/80 px-2.5 py-1 text-xxsmall10 font-semibold text-static-100 md:text-xxsmall12">
            {mentorBadge}
          </span>
        )}
      </div>
      <span className="text-xxsmall12 font-semibold text-primary">
        {typeLabel(target.targetType)}
      </span>
      <p className="line-clamp-2 break-keep text-xsmall16 font-semibold text-neutral-0">
        {getCatalogTitle(target)}
      </p>
      {mentoringMeta && (
        <p className="text-xxsmall12 text-neutral-30">{mentoringMeta}</p>
      )}
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
