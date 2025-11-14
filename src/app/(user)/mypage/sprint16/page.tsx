'use client';

import TalentPoolBanner from '@/components/common/mypage/career/banner/TalentPoolBanner';
import CareerGrowthSection from '@/components/common/mypage/career/section/CareerGrowthSection';
import CareerPlanSection from '@/components/common/mypage/career/section/CareerPlanSection';
import CareerRecordSection from '@/components/common/mypage/career/section/CareerRecordSection';
import DocumentSection from '@/components/common/mypage/career/section/DocumentSection';
import ExperienceSection from '@/components/common/mypage/career/section/ExperienceSection';
import CategoryTabContainer, {
  TabItem,
} from '@/components/common/mypage/career/tab/CategoryTabContainer';

const CareerBoardPage = () => {
  // TODO: 실제 데이터로 교체 필요
  const hasCareerData = true; // 커리어 관리 정보 데이터 존재 여부
  const isTalentPoolRegistered = false; // 인재풀 등록 여부

  const handleTalentPoolToggle = (value: boolean) => {
    // TODO: 인재풀 등록 API 호출
    // eslint-disable-next-line no-console
    console.log('인재풀 등록 상태 변경:', value);
  };

  const boardContent = (
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

  const tabs: TabItem[] = [
    {
      id: 'board',
      label: '커리어 보드',
      content: boardContent,
    },
    {
      id: 'plan',
      label: '커리어 계획',
      content: <div>커리어 계획 페이지</div>,
    },
    {
      id: 'experience',
      label: '경험 정리',
      content: <div>경험 정리 페이지</div>,
    },
    {
      id: 'record',
      label: '커리어 기록',
      content: <div>커리어 기록 페이지</div>,
    },
    {
      id: 'documents',
      label: '서류 정리',
      content: <div>서류 정리 페이지</div>,
    },
  ];

  return (
    <main className="flex w-full flex-col px-5 pb-20">
      <CategoryTabContainer tabs={tabs} defaultTab="board" />
    </main>
  );
};

export default CareerBoardPage;
