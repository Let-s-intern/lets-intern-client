import { getLowestPrice } from '@letscareer/mocks';

import type { LiveMentoringSettings } from '@/api/live-mentoring/liveMentoringSchema';
import {
  CATEGORY_LABELS,
  cardPriceLabel,
  careerBadgeLabel,
  durationsLabel,
  formatOpeningPeriod,
  imagePlaceholderTitle,
} from '../../constants';

interface OpenSettingsPreviewProps {
  settings: LiveMentoringSettings;
}

/**
 * 오픈 설정 미리보기 — **멘티에게 보이는 공개 리스트 카드를 그대로 재현한다.**
 *
 * 원본: `apps/web/src/domain/live-mentoring/list/MentorCard.tsx`.
 * 앱 간 컴포넌트를 공유하지 않는 규칙 때문에 마크업을 복제했다. 웹 카드가 바뀌면
 * 여기도 같이 고쳐야 한다 — 미리보기가 실제와 다르면 없느니만 못하다.
 *
 * 원본과 다른 점은 두 가지뿐이다.
 *  1. 링크가 아니다(설정 화면에서 이동시킬 이유가 없다).
 *  2. `grid-rows-subgrid` 대신 `flex` — subgrid 는 목록 그리드 안에서만 의미가 있다.
 */
const OpenSettingsPreview = ({ settings }: OpenSettingsPreviewProps) => {
  const {
    title,
    nickname,
    profileImage,
    categories,
    durations,
    feedbackStartDate,
    feedbackEndDate,
    careers,
  } = settings;

  // 공개 카드는 **대표 경력만** 노출하고, 미지정이면 배지 자체를 렌더하지 않는다.
  // 여기서 첫 경력으로 폴백하면 실제 노출과 달라져 미리보기가 거짓말을 하게 된다.
  const representativeCareer =
    careers.find((career) => career.isRepresentative) ?? null;
  const badge = careerBadgeLabel(representativeCareer);

  // 편집 중에는 빈 문자열이 들어오므로 null 로 정규화해 공개 카드와 같은 폴백을 태운다.
  const cardTitle = title?.trim() ? title : null;
  const displayNickname = nickname ?? '멘토';
  const price = getLowestPrice(durations);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
      <h2 className="mb-4 text-base font-semibold text-gray-900">미리보기</h2>

      <div className="flex w-full flex-col gap-3 overflow-hidden">
        {/* 썸네일 — 프로필 이미지가 있으면 흰 배경 위 이미지, 없으면 브랜드 컬러 배경 + 제목 텍스트 */}
        <div
          className={`md:rounded-xs relative aspect-[540/421] overflow-hidden rounded-sm ${
            profileImage ? 'bg-white' : 'bg-primary'
          }`}
        >
          {profileImage && (
            <img
              src={profileImage}
              alt={displayNickname}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* 대표 직무 배지 */}
          {badge && (
            <span className="rounded-xs bg-neutral-0/80 text-xxsmall10 text-static-100 md:text-xxsmall12 absolute left-2 top-2 px-2.5 py-1 font-semibold">
              {badge}
            </span>
          )}

          {!profileImage && (
            <p
              className={`text-small18 relative line-clamp-3 px-4 pb-4 font-bold text-white ${
                badge ? 'pt-11' : 'pt-4'
              }`}
            >
              {cardTitle ?? imagePlaceholderTitle(displayNickname)}
            </p>
          )}

          {/* 진행시간 / 가격 바 — 썸네일 위에 겹쳐 카드 높이를 비율에 고정한다 */}
          <div className="bg-neutral-0 text-xsmall14 absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-2.5 text-white">
            <span>{durationsLabel(durations)}</span>
            <span className="font-bold">
              {cardPriceLabel(durations, price)}
            </span>
          </div>
        </div>

        <h3 className="text-1-semibold text-xsmall14 md:text-xsmall16 line-clamp-2">
          {cardTitle ?? `${displayNickname}의 1:1 멘토링`}
        </h3>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1 tracking-[-0.4px] md:gap-1.5">
            <span className="text-xxsmall12 text-neutral-0 font-normal">
              진행기간
            </span>
            <span className="text-0.75-medium text-primary-dark">
              {formatOpeningPeriod(feedbackStartDate, feedbackEndDate)}
            </span>
          </div>

          {categories.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {categories.map((category) => (
                <div
                  key={category}
                  className="text-xxsmall12 border-neutral-95 bg-neutral-95 text-neutral-40 flex items-center justify-center rounded-[3px] border px-2 py-1 text-center font-normal"
                >
                  {CATEGORY_LABELS[category]}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OpenSettingsPreview;
