import { getLowestPrice } from '@letscareer/mocks';

import type { LiveMentoringSettings } from '@/api/live-mentoring/liveMentoringSchema';
import { CATEGORY_LABELS, durationLabel, formatPrice } from '../../constants';

interface OpenSettingsPreviewProps {
  settings: LiveMentoringSettings;
}

/**
 * 오픈 설정 요약 카드 미리보기 (공개 리스트 카드 형태 근사).
 * 모자이크 블러·프로필 비노출(익명 타이틀)을 즉시 반영한다.
 */
const OpenSettingsPreview = ({ settings }: OpenSettingsPreviewProps) => {
  const {
    profileVisible,
    mosaicEnabled,
    mosaicBlur,
    nickname,
    profileImage,
    categories,
    durations,
    feedbackStartDate,
    feedbackEndDate,
    careers,
  } = settings;

  const visibleCareers = careers.filter((c) => c.visible);
  const price = getLowestPrice(durations);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
      <h2 className="mb-4 text-base font-semibold text-gray-900">미리보기</h2>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        {/* 프로필 이미지 영역 */}
        <div className="relative flex h-40 items-center justify-center bg-gray-100">
          {profileVisible ? (
            profileImage ? (
              <img
                src={profileImage}
                alt="프로필 미리보기"
                className="h-full w-full object-cover"
                style={
                  mosaicEnabled
                    ? { filter: `blur(${mosaicBlur}px)` }
                    : undefined
                }
                data-testid="preview-profile-image"
              />
            ) : (
              <span className="text-sm text-gray-500">프로필 이미지</span>
            )
          ) : (
            <div
              className="text-primary flex flex-col items-center gap-1 px-4 text-center"
              data-testid="preview-anonymous-title"
            >
              <span className="text-xs font-medium text-gray-500">
                비공개 프로필
              </span>
              <span className="text-base font-semibold">
                {nickname}의 1대1 라이브 멘토링
              </span>
            </div>
          )}
        </div>

        {/* 메타 영역 */}
        <div className="flex flex-col gap-2 p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="bg-primary-10 text-primary rounded px-2 py-0.5 text-xs font-medium">
              {categories.map((c) => CATEGORY_LABELS[c]).join(' · ')}
            </span>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {durations.map(durationLabel).join('·')}
            </span>
          </div>
          {profileVisible && (
            <p className="text-sm font-semibold text-gray-900">{nickname}</p>
          )}
          {visibleCareers.length > 0 && (
            <p className="text-xs text-gray-500">
              {visibleCareers[0].company} · {visibleCareers[0].position}
            </p>
          )}
          <p className="text-xs text-gray-500">
            피드백 {feedbackStartDate.slice(5)} ~ {feedbackEndDate.slice(5)}
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
