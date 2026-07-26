import { getLowestPrice } from '@letscareer/mocks';

import type { LiveMentoringSettings } from '@/api/live-mentoring/liveMentoringSchema';
import {
  CATEGORY_LABELS,
  durationLabel,
  formatCareerPeriod,
  formatPrice,
  representativeCareerLabel,
} from '../../constants';

interface OpenSettingsPreviewProps {
  settings: LiveMentoringSettings;
}

/** 오픈 설정 요약 카드 미리보기 (공개 리스트 카드 형태 근사). */
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

  // 공개 카드는 **대표 경력만** 노출하고, 미지정이면 경력 줄 자체를 렌더하지 않는다.
  // 여기서 첫 경력으로 폴백하면 실제 노출과 달라져 미리보기가 거짓말을 하게 된다.
  const representativeCareer =
    careers.find((career) => career.isRepresentative) ?? null;
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
              {representativeCareerLabel(representativeCareer)}
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
