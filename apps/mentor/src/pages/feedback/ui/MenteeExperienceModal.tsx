'use client';

import BaseModal from '@/common/modal/BaseModal';
import {
  ACTIVITY_TYPE_KR,
  EXPERIENCE_CATEGORY_KR,
  type UserAttendanceExperience,
} from '@/api/experience/experienceSchema';
import { useMenteeExperiencesQuery } from '../hooks/useMenteeExperiencesQuery';

interface MenteeExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionId?: number;
  userId?: number | null;
  menteeName?: string;
}

type ExperienceItem = UserAttendanceExperience[number];

const formatPeriod = (
  startDate?: string | null,
  endDate?: string | null,
): string => {
  if (!startDate || !endDate) return '-';
  const start = new Date(startDate).toLocaleDateString('ko-KR');
  const end = new Date(endDate).toLocaleDateString('ko-KR');
  return `${start} ~ ${end}`;
};

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-neutral-500">{label}</span>
    <p className="whitespace-pre-wrap break-words text-sm text-neutral-800">
      {value && value.trim() ? value : '-'}
    </p>
  </div>
);

const ExperienceCard = ({ experience }: { experience: ExperienceItem }) => {
  const category = experience.experienceCategory
    ? EXPERIENCE_CATEGORY_KR[experience.experienceCategory]
    : experience.customCategoryName || '-';
  const activity = experience.activityType
    ? ACTIVITY_TYPE_KR[experience.activityType]
    : '-';

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4">
      <div className="flex flex-wrap items-baseline gap-2">
        <h4 className="text-base font-semibold text-neutral-900">
          {experience.title?.trim() || '제목 없음'}
        </h4>
        <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
          {category}
        </span>
        <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
          {activity}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

const MenteeExperienceModal = ({
  isOpen,
  onClose,
  missionId,
  userId,
  menteeName,
}: MenteeExperienceModalProps) => {
  const { data, isLoading, isError, refetch } = useMenteeExperiencesQuery({
    missionId,
    userId,
    // 모달이 열린 상태에서만 노출 — 제출됨·링크없음 멘티에 대해서만 진입함
    isAbsent: false,
    hasLink: false,
  });

  const experiences = data?.userExperiences ?? [];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="mx-2 flex h-[85vh] w-[800px] max-w-full flex-col rounded-2xl md:mx-4 md:h-[680px]"
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h3 className="text-lg font-semibold text-neutral-900">
          {menteeName ? `${menteeName} 님의 ` : ''}제출 경험
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="flex h-8 w-8 items-center justify-center rounded text-neutral-500 hover:bg-neutral-100"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            경험을 불러오는 중입니다...
          </div>
        ) : isError ? (
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
        ) : experiences.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            제출된 경험이 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {experiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default MenteeExperienceModal;
