import { useSearchUserExperiencesQuery } from '@/api/userExperience';
import { If } from '@/components/common/If';
import dayjs from '@/lib/dayjs';
import { Dayjs } from 'dayjs';
import { useMemo } from 'react';
import { ExperienceData, isUserExperienceComplete } from '../data';
import { EmptyState } from './EmptyState';
import { ExperienceList } from './ExperienceList';

type ExperienceLevel = 'LV1' | 'LV2';

interface MissionSubmitExperienceListProps {
  selectedExperiences: ExperienceData[];
  onOpenModal: () => void;
  level: ExperienceLevel;
  missionStartDate?: Dayjs | null;
  isSubmitted?: boolean;
  isEditing?: boolean;
}

export const MissionSubmitExperienceList = ({
  selectedExperiences,
  onOpenModal,
  level,
  missionStartDate,
  isSubmitted,
  isEditing,
}: MissionSubmitExperienceListProps) => {
  const { data } = useSearchUserExperiencesQuery({
    experienceCategories: [],
    activityTypes: [],
    years: [],
    coreCompetencies: [],
    sortType: 'LATEST' as const,
    page: 1,
    size: 100,
  });
  // 제출 가능한 경험 필터링: LV1은 전체, LV2는 미션 시작일 이후 생성/수정된 경험만
  // 마지막에 경험정리 필드 모두 채운 경험만 필터링
  const submitableExperiences = useMemo(() => {
    if (!data?.userExperiences) return [];

    let filtered: typeof data.userExperiences;

    if (level === 'LV1') {
      filtered = data.userExperiences;
    } else {
      if (!missionStartDate) {
        return [];
      }

      filtered = data.userExperiences.filter((exp) => {
        const createDate = dayjs(exp.createDate);
        const lastModifiedDate = dayjs(exp.lastModifiedDate);
        return (
          createDate.isAfter(missionStartDate, 'day') ||
          createDate.isSame(missionStartDate, 'day') ||
          lastModifiedDate.isAfter(missionStartDate, 'day') ||
          lastModifiedDate.isSame(missionStartDate, 'day')
        );
      });
    }

    // 경험정리 필드 모두 채운 경험만
    return filtered.filter(isUserExperienceComplete);
  }, [data, level, missionStartDate]);

  const experienceCount = submitableExperiences.length;

  // 버튼 비활성화 조건:
  // 1. 경험 수가 3개 미만이면 disabled
  // 2. 제출되어 있고 수정 모드가 아니면 disabled
  // 3. 그 외 (경험 수 3개 이상이고, (제출 안 됨 OR 수정 모드임)) → enabled
  const isButtonDisabled =
    experienceCount < 3 || (isSubmitted === true && isEditing !== true);

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
            isButtonDisabled ? 'text-neutral-50' : 'text-primary'
          }`}
        >
          작성한 경험 불러오기
        </button>
      </div>

      {/* 작성된 경험 불러오는 컴포넌트 */}
      <div className="flex min-h-[200px] items-center justify-center rounded-xxs border border-neutral-80 bg-white">
        <div className="flex w-full flex-col items-center justify-center space-y-4">
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
