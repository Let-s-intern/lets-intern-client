import { useState } from 'react';
import { ExperienceSelectModal } from './components/ExperienceSelectModal';
import { MissionSubmitExperienceList } from './components/MissionSubmitExperienceList';
import { MissionSubmitGuidance } from './components/MissionSubmitGuidance';
import { ExperienceData } from './data';

interface MissionSubmitListFormProps {
  experienceCount?: number;
  experiences?: ExperienceData[];
  onExperienceIdsChange?: (ids: number[]) => void;
}

export const MissionSubmitListForm = ({
  experienceCount = 0,
  onExperienceIdsChange,
}: MissionSubmitListFormProps) => {
  // 테스트용으로 experienceCount를 4로 설정
  experienceCount = 3;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperiences, setSelectedExperiences] = useState<
    ExperienceData[]
  >([]);

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
        experienceCount={experienceCount}
        selectedExperiences={selectedExperiences}
        onOpenModal={handleOpenModal}
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
