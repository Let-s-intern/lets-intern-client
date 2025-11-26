import TalentPoolBanner from './banner/TalentPoolBanner';
import { useCareerDataStatus } from './contexts/CareerDataStatusContext';
import CareerGrowthSection from './sections/CareerGrowthSection';
import CareerPlanSection from './sections/CareerPlanSection';
import CareerRecordSection from './sections/CareerRecordSection';
import ExperienceSection from './sections/ExperienceSection';
import DocumentSection from './sections/ResumeSection';

const CareerBoard = () => {
  const { hasCareerData } = useCareerDataStatus(); // 커리어 관리 정보 데이터 존재 여부
  const isTalentPoolRegistered = false; // 인재풀 등록 여부

  const handleTalentPoolToggle = (value: boolean) => {
    // TODO: 인재풀 등록 API 호출
    // eslint-disable-next-line no-console
    console.log('인재풀 등록 상태 변경:', value);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <TalentPoolBanner
        hasCareerData={hasCareerData}
        isRegistered={isTalentPoolRegistered}
        onToggle={handleTalentPoolToggle}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CareerPlanSection />
        <ExperienceSection />
        <CareerRecordSection />
        <DocumentSection />
      </div>
      <CareerGrowthSection />
    </div>
  );
};

export default CareerBoard;
