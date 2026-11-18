import { ProgramCategoryTarget } from '@/api/program-category/programCategory';
import { getTargetHref } from '@/domain/career-journey/journeyNav';
import dayjs from '@/lib/dayjs';
import Link from 'next/link';
import { getPeriodText, TARGET_TYPE_LABEL } from '../landingCard';

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
      <Thumbnail src={target.thumbnail} />
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
    <Thumbnail src={target.thumbnail} className="aspect-[5/4]" />
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
