import { useSearchUserExperiencesQuery } from '@/api/userExperience';
import dayjs from '@/lib/dayjs';
import { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { ExperienceSelectModal } from './components/ExperienceSelectModal';
import { MissionSubmitExperienceList } from './components/MissionSubmitExperienceList';
import { MissionSubmitGuidance } from './components/MissionSubmitGuidance';
import { convertUserExperienceToExperienceData, ExperienceData } from './data';

type ExperienceLevel = 'LV1' | 'LV2';

interface MissionSubmitListFormProps {
  onExperienceIdsChange?: (ids: number[]) => void;
  initialExperienceIds?: number[] | null;
  isLoadButtonEnabled?: boolean;
  missionStartDate?: Dayjs | null;
}

export const MissionSubmitListForm = ({
  onExperienceIdsChange,
  initialExperienceIds,
  isLoadButtonEnabled = false,
  missionStartDate,
}: MissionSubmitListFormProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperiences, setSelectedExperiences] = useState<
    ExperienceData[]
  >([]);

  // 모든 경험 데이터 검색 (초기 로드용)
  const { data: allExperiencesData } = useSearchUserExperiencesQuery(
    {
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
    },
    !!initialExperienceIds && initialExperienceIds.length > 0,
  );

  // 레벨 결정 로직: 미션 시작일 이전에 생성되고 isAddedByAdmin = false인 경험이 하나라도 있으면 LV2, 없으면 LV1
  const level = useMemo<ExperienceLevel>(() => {
    if (!missionStartDate || !allExperiencesData?.userExperiences) {
      return 'LV1';
    }

    const hasUserCreatedExperienceBeforeMissionStart =
      allExperiencesData.userExperiences.some((exp) => {
        const createDate = dayjs(exp.createDate);
        return (
          !exp.isAddedByAdmin && createDate.isBefore(missionStartDate, 'day')
        );
      });

    return hasUserCreatedExperienceBeforeMissionStart ? 'LV2' : 'LV1';
  }, [allExperiencesData, missionStartDate]);
  // initialExperienceIds가 변경되면 초기 선택 상태 설정
  useEffect(() => {
    if (!initialExperienceIds || initialExperienceIds.length === 0) {
      setSelectedExperiences([]);
      onExperienceIdsChange?.([]);
      return;
    }

    if (!allExperiencesData?.userExperiences) {
      return;
    }

    // 모든 경험을 ExperienceData로 변환
    const allExperiences = allExperiencesData.userExperiences.map(
      convertUserExperienceToExperienceData,
    );

    // initialExperienceIds에 포함된 경험만 필터링
    const initialExperiences = allExperiences.filter((exp) =>
      initialExperienceIds.includes(exp.originalId),
    );

    setSelectedExperiences(initialExperiences);
    onExperienceIdsChange?.(initialExperienceIds);
  }, [initialExperienceIds, allExperiencesData, onExperienceIdsChange]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectComplete = (selectedExperiences: ExperienceData[]) => {
    setSelectedExperiences(selectedExperiences);
    // 선택된 경험들의 originalId 추출하여 부모에게 전달
    const experienceIds = selectedExperiences.map((exp) => exp.originalId);
    onExperienceIdsChange?.(experienceIds);
    setIsModalOpen(false);
  };
  return (
    <div className="space-y-6">
      {/* 미션 제출 안내사항 */}
      <MissionSubmitGuidance />

      {/* 제출할 경험 목록 */}
      <MissionSubmitExperienceList
        selectedExperiences={selectedExperiences}
        onOpenModal={handleOpenModal}
        isLoadButtonEnabled={isLoadButtonEnabled}
        level={level}
        missionStartDate={missionStartDate}
      />

      {/* 경험 선택 모달 */}
      <ExperienceSelectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectComplete={handleSelectComplete}
      />
    </div>
  );
};
