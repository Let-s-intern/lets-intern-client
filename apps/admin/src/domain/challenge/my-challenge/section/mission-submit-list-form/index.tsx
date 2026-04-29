import { useSearchUserExperiencesQuery } from '@/api/user/userExperience';
import { useEffect, useState } from 'react';
import { ExperienceSelectModal } from './components/ExperienceSelectModal';
import { MissionSubmitExperienceList } from './components/MissionSubmitExperienceList';
import { MissionSubmitGuidance } from './components/MissionSubmitGuidance';
import { convertUserExperienceToExperienceData, ExperienceData } from './data';

type ExperienceLevel = 'LV1' | 'LV2';

interface MissionSubmitListFormProps {
  onExperienceIdsChange?: (ids: number[]) => void;
  initialExperienceIds?: number[] | null;
  isSubmitted?: boolean;
  isEditing?: boolean;
  missionType?: string | null;
}

export const MissionSubmitListForm = ({
  onExperienceIdsChange,
  initialExperienceIds,
  isSubmitted,
  isEditing,
  missionType,
}: MissionSubmitListFormProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperiences, setSelectedExperiences] = useState<
    ExperienceData[]
  >([]);

  // 모든 경험 데이터 검색 (초기 로드용)
  const { data: allExperiencesData } = useSearchUserExperiencesQuery(
    {
      experienceCategories: [],
      activityTypes: [],
      years: [],
      coreCompetencies: [],
      sortType: 'LATEST' as const,
      page: 1,
      size: 100,
    },
    !!initialExperienceIds && initialExperienceIds.length > 0,
  );

  const level: ExperienceLevel = missionType === 'EXPERIENCE_1' ? 'LV1' : 'LV2';
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

  const handleDeleteExperience = (experienceId: number) => {
    const updatedExperiences = selectedExperiences.filter(
      (exp) => exp.originalId !== experienceId,
    );
    setSelectedExperiences(updatedExperiences);
    // 업데이트된 경험들의 originalId 추출하여 부모에게 전달
    const experienceIds = updatedExperiences.map((exp) => exp.originalId);
    onExperienceIdsChange?.(experienceIds);
  };

  return (
    <div className="space-y-6">
      {/* 미션 제출 안내사항 */}
      <MissionSubmitGuidance />

      {/* 제출할 경험 목록 */}
      <MissionSubmitExperienceList
        selectedExperiences={selectedExperiences}
        onOpenModal={handleOpenModal}
        onDeleteExperience={handleDeleteExperience}
        level={level}
        isSubmitted={isSubmitted}
        isEditing={isEditing}
      />

      {/* 경험 선택 모달 */}
      <ExperienceSelectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectComplete={handleSelectComplete}
        initialSelectedExperienceIds={selectedExperiences.map(
          (exp) => exp.originalId,
        )}
      />
    </div>
  );
};
