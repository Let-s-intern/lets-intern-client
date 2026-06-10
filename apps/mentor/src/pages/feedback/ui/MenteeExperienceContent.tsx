'use client';

import {
  ACTIVITY_TYPE_KR,
  EXPERIENCE_CATEGORY_KR,
  type UserAttendanceExperience,
} from '@/api/experience/experienceSchema';
import { useMenteeExperiencesQuery } from '../hooks/useMenteeExperiencesQuery';

type ExperienceItem = UserAttendanceExperience[number];

interface MenteeExperienceContentProps {
  missionId?: number;
  userId?: number | null;
  /** 좁은 영역(사이드 패널)용 — 필드를 1열로 표시 */
  compact?: boolean;
}

/**
 * "YYYY-MM-DD" → "YYYY. M. D." — new Date()는 UTC로 파싱해 음수 오프셋
 * 타임존에서 날짜가 하루 밀릴 수 있으므로 문자열로 직접 포맷한다.
 */
const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${year}. ${Number(month)}. ${Number(day)}.`;
};

const formatPeriod = (
  startDate?: string | null,
  endDate?: string | null,
): string => {
  if (!startDate || !endDate) return '-';
  return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
};

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-neutral-500">{label}</span>
    <p className="whitespace-pre-wrap break-words rounded-md bg-[#f7f8fa] px-2.5 py-2 text-sm text-neutral-800">
      {value && value.trim() ? value : '-'}
    </p>
  </div>
);

const ExperienceCard = ({
  experience,
  compact = false,
}: {
  experience: ExperienceItem;
  compact?: boolean;
}) => {
  const category = experience.experienceCategory
    ? EXPERIENCE_CATEGORY_KR[experience.experienceCategory]
    : experience.customCategoryName || '-';
  const activity = experience.activityType
    ? ACTIVITY_TYPE_KR[experience.activityType]
    : '-';

  return (
    <div
      className={`flex flex-col rounded-xl border border-gray-200 ${
        compact ? 'gap-3 p-3' : 'gap-4 p-4'
      }`}
    >
      <div className="flex flex-wrap items-baseline gap-2">
        <h4
          className={`font-semibold text-neutral-900 ${
            compact ? 'text-sm' : 'text-base'
          }`}
        >
          {experience.title?.trim() || '제목 없음'}
        </h4>
        <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
          {category}
        </span>
        <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
          {activity}
        </span>
      </div>

      <div
        className={`grid gap-3 ${
          compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        <Field label="기관" value={experience.organ} />
        <Field
          label="기간"
          value={formatPeriod(experience.startDate, experience.endDate)}
        />
        <Field label="역할 및 담당 업무" value={experience.role} />
        <Field label="핵심 역량" value={experience.coreCompetency} />
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Field label="Situation (상황)" value={experience.situation} />
        <Field label="Task (문제)" value={experience.task} />
        <Field label="Action (행동)" value={experience.action} />
        <Field label="Result (결과)" value={experience.result} />
        <Field label="느낀 점 / 배운 점" value={experience.reflection} />
      </div>
    </div>
  );
};

/**
 * 멘티 경험정리 제출물 목록 — 로딩/에러/빈 상태 포함.
 * 서브모달(MenteeExperienceModal)과 사이드 패널(MenteeExperiencePanel)에서 공용.
 */
const MenteeExperienceContent = ({
  missionId,
  userId,
  compact = false,
}: MenteeExperienceContentProps) => {
  const { data, isLoading, isError, refetch } = useMenteeExperiencesQuery({
    missionId,
    userId,
    // 진입점 자체가 제출됨·링크없음 멘티에 대해서만 노출됨
    isAbsent: false,
    hasLink: false,
  });

  const experiences = data?.userExperiences ?? [];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-neutral-400">
        경험을 불러오는 중입니다...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-red-500">경험을 불러오지 못했습니다.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-neutral-400">
        제출된 경험이 없습니다.
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${compact ? 'gap-3' : 'gap-4'}`}>
      {experiences.map((experience) => (
        <ExperienceCard
          key={experience.id}
          experience={experience}
          compact={compact}
        />
      ))}
    </div>
  );
};

export default MenteeExperienceContent;
