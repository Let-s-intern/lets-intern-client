import { ProgramCategoryTarget } from '@/api/program-category/programCategory';
import { getTargetHref } from '@/domain/career-journey/journeyNav';
import dayjs from '@/lib/dayjs';
import Link from 'next/link';
import {
  formatPrice,
  getChallengeDisplayTitle,
  getPeriodText,
  TARGET_TYPE_LABEL,
} from '../landingCard';
import ChallengeThumbnail from './ChallengeThumbnail';

/** 멘토링 썸네일이 없을 때 쓰는 배경. 멘토 목록 카드와 같은 색을 멘토 번호로 고른다 */
const MENTOR_FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #FF6A1A 0%, #FF9A4D 100%)',
  'linear-gradient(135deg, #4D55F5 0%, #7B82FF 100%)',
  'linear-gradient(135deg, #1DB36B 0%, #4FD39A 100%)',
  'linear-gradient(135deg, #13A6E0 0%, #52CBF6 100%)',
  'linear-gradient(135deg, #2B2F8F 0%, #4D55F5 100%)',
];

const hrefOf = (target: ProgramCategoryTarget) =>
  getTargetHref(target.targetType, target.targetId, {
    title: target.title,
    mentorId: target.mentorId,
  });

const Thumbnail = ({
  src,
  className = 'aspect-[4/3]',
}: {
  src?: string | null;
  className?: string;
}) => (
  <div
    className={`${className} w-full overflow-hidden rounded-xs bg-neutral-95`}
  >
    {src ? (
      // 썸네일 출처가 여러 버킷이라 next/image 도메인 설정에 묶지 않는다
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className="h-full w-full object-cover" />
    ) : null}
  </div>
);

/** LIVE·VOD·가이드북·자료집·패스 카드. 기간이 없으면 "즉시 수강 가능" */
export const ProgramTargetCard = ({
  target,
}: {
  target: ProgramCategoryTarget;
}) => {
  const period = getPeriodText(target);
  return (
    <Link
      href={hrefOf(target)}
      className="category_landing_card flex flex-col gap-2"
      data-type={target.targetType}
      data-id={target.targetId}
    >
      {target.targetType === 'CHALLENGE' ? (
        <div className="aspect-[4/3] w-full overflow-hidden rounded-xs bg-neutral-95">
          <ChallengeThumbnail
            challengeType={target.challengeType}
            title={target.title}
            displayTitle={getChallengeDisplayTitle(target.title)}
            fallbackSrc={target.thumbnail}
          />
        </div>
      ) : (
        <Thumbnail src={target.thumbnail} />
      )}
      <span className="w-fit rounded-xs bg-primary-10 px-1.5 py-0.5 text-xxsmall12 font-semibold text-primary">
        {TARGET_TYPE_LABEL[target.targetType]}
      </span>
      <p className="line-clamp-2 text-xsmall16 font-semibold text-neutral-0">
        {target.title}
      </p>
      {period && target.targetType !== 'MAGNET' ? (
        <p className="text-xxsmall12 text-neutral-30">
          진행기간 <span className="text-primary">{period}</span>
        </p>
      ) : (
        <span className="w-fit rounded-xs bg-primary-5 px-1.5 py-0.5 text-xxsmall12 text-primary">
          즉시 수강 가능
        </span>
      )}
    </Link>
  );
};

/** 1:1 LIVE 멘토링 카드. 썸네일(없으면 회색)과 제목 */
export const MentorTargetCard = ({
  target,
}: {
  target: ProgramCategoryTarget;
}) => (
  <Link
    href={hrefOf(target)}
    className="category_landing_card flex flex-col gap-2"
    data-type={target.targetType}
    data-id={target.targetId}
  >
    <div
      className="relative aspect-[5/4] w-full overflow-hidden rounded-xs bg-neutral-95"
      style={
        target.thumbnail
          ? undefined
          : {
              background:
                MENTOR_FALLBACK_GRADIENTS[
                  (target.mentorId ?? target.targetId) %
                    MENTOR_FALLBACK_GRADIENTS.length
                ],
            }
      }
    >
      {target.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={target.thumbnail}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <>
          <img
            src="/logo/logo-simple.svg"
            alt=""
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-4 w-[58%] opacity-[0.14] brightness-0 invert"
          />
          <div className="relative flex h-full flex-col justify-center overflow-hidden px-4 pb-10 pt-9">
            <p className="line-clamp-3 break-keep text-small18 font-bold leading-snug text-white">
              {target.title}
            </p>
          </div>
        </>
      )}
      {(target.mentorCompany || target.mentorJob) && (
        <span className="absolute left-2 top-2 max-w-[90%] truncate rounded-xxs bg-neutral-0/80 px-1.5 py-0.5 text-xxsmall12 font-semibold text-white">
          {[target.mentorCompany, target.mentorJob].filter(Boolean).join(' · ')}
        </span>
      )}
      {(target.durations?.length || target.price != null) && (
        <span className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-4 text-xxsmall12 font-semibold text-white">
          <span>
            {(target.durations ?? []).map((d) => `${d}분`).join(' / ')}
          </span>
          {target.price != null && <span>{formatPrice(target.price)}~</span>}
        </span>
      )}
    </div>
    <p className="line-clamp-2 text-xsmall16 font-semibold text-neutral-0">
      {target.title}
    </p>
  </Link>
);

/** 블로그 카드. 게시일을 쓴다 */
export const BlogTargetCard = ({
  target,
}: {
  target: ProgramCategoryTarget;
}) => (
  <Link
    href={hrefOf(target)}
    className="category_landing_card flex flex-col gap-2"
    data-type={target.targetType}
    data-id={target.targetId}
  >
    <Thumbnail src={target.thumbnail} />
    <p className="line-clamp-2 text-xsmall16 font-semibold text-neutral-0">
      {target.title}
    </p>
    {target.startDate && (
      <p className="text-xxsmall12 text-neutral-40">
        {dayjs(target.startDate).format('YYYY. MM. DD')} 작성
      </p>
    )}
  </Link>
);

export { hrefOf as getLandingTargetHref };
