import { getLowestPrice } from '@letscareer/mocks';

import type { LiveMentoringSettings } from '@/api/live-mentoring/liveMentoringSchema';
import {
  CATEGORY_LABELS,
  durationLabel,
  formatCareerPeriod,
  formatPrice,
} from '../../constants';

interface OpenSettingsPreviewProps {
  settings: LiveMentoringSettings;
  /** 대표 경력 id — 백엔드에 대표 지정 필드가 없어 로컬 선택값을 그대로 받는다. */
  representativeCareerId: number | null;
}

/** 오픈 설정 요약 카드 미리보기 (공개 리스트 카드 형태 근사). */
const OpenSettingsPreview = ({
  settings,
  representativeCareerId,
}: OpenSettingsPreviewProps) => {
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

  const representativeCareer =
    careers.find((c) => c.id === representativeCareerId) ?? careers[0];
  const price = getLowestPrice(durations);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
      <h2 className="mb-4 text-base font-semibold text-gray-900">미리보기</h2>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        {/* 프로필 이미지 영역 */}
        <div className="relative flex h-40 items-center justify-center bg-gray-100">
          {profileImage ? (
            <img
              src={profileImage}
              alt="프로필 미리보기"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm text-gray-500">프로필 이미지</span>
          )}
        </div>

        {/* 메타 영역 */}
        <div className="flex flex-col gap-2 p-4">
          <p className="text-sm font-semibold text-gray-900">
            {title || '타이틀을 입력해주세요'}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="bg-primary-10 text-primary rounded px-2 py-0.5 text-xs font-medium">
              {categories.map((c) => CATEGORY_LABELS[c]).join(' · ')}
            </span>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {durations.map(durationLabel).join('·')}
            </span>
          </div>
          <p className="text-xs text-gray-500">{nickname}</p>
          {representativeCareer && (
            <p className="text-xs text-gray-500">
              {representativeCareer.company} · {representativeCareer.position}
              {representativeCareer.startDate && (
                <>
                  {' '}
                  (
                  {formatCareerPeriod(
                    representativeCareer.startDate,
                    representativeCareer.endDate,
                  )}
                  )
                </>
              )}
            </p>
          )}
          <p className="text-xs text-gray-500">
            피드백 {(feedbackStartDate ?? '').slice(5) || '미정'} ~{' '}
            {(feedbackEndDate ?? '').slice(5) || '미정'}
          </p>
          <p className="text-primary text-sm font-semibold">
            {durations.length > 1 ? '최저 ' : ''}
            {formatPrice(price)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default OpenSettingsPreview;
