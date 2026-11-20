import dayjs from '@/lib/dayjs';
import type { PublicCategoryTarget } from '../../hooks/usePublicCategoryTargets';
import {
  formatPrice,
  getChallengeDisplayTitle,
  getDeadlineText,
  getPeriodText,
  isClosingSoon,
  TARGET_TYPE_LABEL,
} from '../utils/landingCard';

/**
 * 웹 카테고리 랜딩 카드(FeaturedChallenge·TargetCards)의 마크업을 옮겼다. 링크만 뺐다.
 * 챌린지 기본 썸네일(유형별 이미지·제목 얹기)은 웹 정적 파일이라 여기서는 등록 썸네일을 쓴다
 */

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
      <img src={src} alt="" className="h-full w-full object-cover" />
    ) : null}
  </div>
);

/** 비어 있는 자리. 데이터가 없을 때 회색 막대로 둔다 */
const Bone = ({ className }: { className: string }) => (
  <span className={`block rounded-xxs bg-neutral-90 ${className}`} />
);

export const FeaturedCard = ({ target }: { target: PublicCategoryTarget }) => {
  const period = getPeriodText(target);
  const deadline = getDeadlineText(target);
  const price = formatPrice(target.price);
  return (
    <div className="flex flex-row gap-6">
      <div className="w-[288px] shrink-0">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-sm bg-neutral-95">
          {target.thumbnail && (
            <img
              src={target.thumbnail}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col py-3">
        {isClosingSoon(target) && (
          <span className="mb-2 w-fit rounded-xxs bg-system-error/10 px-1.5 py-0.5 text-xxsmall12 font-semibold text-system-error">
            {deadline ? `${deadline} 마감 임박` : '마감 임박'}
          </span>
        )}
        <h3 className="text-medium22 font-bold text-neutral-0">
          {getChallengeDisplayTitle(target.title)}
        </h3>
        {target.shortDesc ? (
          <p className="mt-1.5 text-xsmall16 text-neutral-30">
            {target.shortDesc}
          </p>
        ) : (
          <Bone className="mt-2 h-4 w-2/3" />
        )}
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-neutral-85 pt-4">
          <div className="flex flex-col gap-0.5">
            {price ? (
              <p className="flex items-baseline gap-3 text-xsmall14 text-neutral-30">
                {TARGET_TYPE_LABEL[target.targetType]} 신청가
                <span className="text-small20 font-bold text-neutral-0">
                  {price}
                </span>
              </p>
            ) : (
              <Bone className="h-5 w-40" />
            )}
            {period && (
              <p className="text-xsmall14 text-neutral-30">
                진행기간{' '}
                <span className="font-semibold text-primary">{period}</span>
              </p>
            )}
          </div>
          <span className="shrink-0 rounded-xs bg-primary px-5 py-2.5 text-xsmall16 font-semibold text-white">
            신청하기
          </span>
        </div>
      </div>
    </div>
  );
};

export const PassFreeNotice = () => (
  <div className="flex items-center justify-between rounded-xs bg-primary-5 px-4 py-3 text-xsmall14">
    <span className="flex items-center gap-2">
      <span className="rounded-full bg-primary px-2 py-0.5 text-xxsmall12 font-semibold text-white">
        ALL-IN-ONE PASS
      </span>
      올인원 패스 회원은 <span className="text-primary">무료</span>로 참여 가능!
    </span>
    <span className="text-primary">패스 혜택 보기 ›</span>
  </div>
);

export const ProgramCard = ({ target }: { target: PublicCategoryTarget }) => {
  const period = getPeriodText(target);
  return (
    <div className="flex flex-col gap-2">
      <Thumbnail src={target.thumbnail} />
      <span className="w-fit rounded-xs bg-primary-10 px-1.5 py-0.5 text-xxsmall12 font-semibold text-primary">
        {TARGET_TYPE_LABEL[target.targetType] ?? target.targetType}
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
    </div>
  );
};

export const MentorCard = ({ target }: { target: PublicCategoryTarget }) => (
  <div className="flex flex-col gap-2">
    <div className="relative aspect-[5/4] w-full overflow-hidden rounded-xs bg-neutral-95">
      {target.thumbnail && (
        <img
          src={target.thumbnail}
          alt=""
          className="h-full w-full object-cover"
        />
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
  </div>
);

export const BlogCard = ({ target }: { target: PublicCategoryTarget }) => (
  <div className="flex flex-col gap-2">
    <Thumbnail src={target.thumbnail} />
    <p className="line-clamp-2 text-xsmall16 font-semibold text-neutral-0">
      {target.title}
    </p>
    {target.startDate && (
      <p className="text-xxsmall12 text-neutral-40">
        {dayjs(target.startDate).format('YYYY. MM. DD')} 작성
      </p>
    )}
  </div>
);
