import { useSearchUserExperiencesQuery } from '@/api/userExperience';
import { If } from '@/components/common/If';
import dayjs from '@/lib/dayjs';
import { Dayjs } from 'dayjs';
import { useMemo } from 'react';
import { ExperienceData } from '../data';
import { EmptyState } from './EmptyState';
import { ExperienceList } from './ExperienceList';

type ExperienceLevel = 'LV1' | 'LV2';

interface MissionSubmitExperienceListProps {
  selectedExperiences: ExperienceData[];
  onOpenModal: () => void;
  isLoadButtonEnabled?: boolean;
  level: ExperienceLevel;
  missionStartDate?: Dayjs | null;
}

export const MissionSubmitExperienceList = ({
  selectedExperiences,
  onOpenModal,
  isLoadButtonEnabled = false,
  level,
  missionStartDate,
}: MissionSubmitExperienceListProps) => {
  const { data } = useSearchUserExperiencesQuery({
    filter: {
      experienceCategories: [],
      activityTypes: [],
      years: [],
      coreCompetencies: [],
    },
    pageable: {
      page: 0,
      size: 100,
    },
  });
  // 제출 가능한 경험 필터링: LV1은 전체, LV2는 미션 시작일 이후 생성/수정된 경험만
  const submitableExperiences = useMemo(() => {
    if (!data?.userExperiences) return [];

    if (level === 'LV1') {
      return data.userExperiences;
    }

    if (!missionStartDate) {
      return [];
    }

    return data.userExperiences.filter((exp) => {
      const createDate = dayjs(exp.createDate);
      const lastModifiedDate = dayjs(exp.lastModifiedDate);
      return (
        createDate.isAfter(missionStartDate, 'day') ||
        createDate.isSame(missionStartDate, 'day') ||
        lastModifiedDate.isAfter(missionStartDate, 'day') ||
        lastModifiedDate.isSame(missionStartDate, 'day')
      );
    });
  }, [data, level, missionStartDate]);

  const experienceCount = submitableExperiences.length;

  const isButtonDisabled = isLoadButtonEnabled || experienceCount < 3;

  // EmptyState 텍스트 결정
  const getEmptyStateText = () => {
    if (experienceCount === 0) {
      if (level === 'LV1') {
        return '작성된 경험이 없습니다.\n미션을 제출하려면 최소 3개의 경험이 필요해요.';
      }
      return '제출 가능한 경험이 없습니다.\n새로운 경험을 추가하거나 기존 경험을 수정해주세요.';
    }

    if (experienceCount > 0 && experienceCount < 3) {
      if (level === 'LV1') {
        return '제출 가능한 경험이 3개 미만입니다.\n미션을 제출하려면 최소 3개의 경험이 필요해요.';
      }
      return '제출 가능한 경험이 3개 미만입니다.\n새로운 경험을 추가하거나 기존 경험을 수정해주세요.';
    }

    return null;
  };

  const emptyStateText = getEmptyStateText();

  const handleExperienceWriteClick = () => {
    window.open('/mypage/experience', '_blank');
  };

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-small18 font-semibold text-neutral-0">
          제출할 경험 목록
        </h3>
        <button
          type="button"
          onClick={onOpenModal}
          disabled={isButtonDisabled}
          className={`rounded-xxs border border-neutral-80 bg-white px-3 py-2 text-xsmall14 font-medium disabled:cursor-not-allowed ${
            !isButtonDisabled && experienceCount >= 3
              ? 'text-primary'
              : 'text-neutral-50'
          }`}
        >
          작성한 경험 불러오기
        </button>
      </div>

      {/* 작성된 경험 불러오는 컴포넌트 */}
      <div className="flex min-h-[200px] items-center justify-center rounded-xxs border border-neutral-80 bg-white">
        <div className="flex flex-col items-center justify-center space-y-4">
          <If condition={emptyStateText !== null}>
            <EmptyState
              text={emptyStateText ?? ''}
              buttonText="경험 작성하기"
              onButtonClick={handleExperienceWriteClick}
            />
          </If>

          <If condition={experienceCount >= 3}>
            <ExperienceList experiences={selectedExperiences} />
          </If>
        </div>
      </div>
    </section>
  );
};
