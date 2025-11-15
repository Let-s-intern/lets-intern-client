'use client';

import CategoryTabContainer, {
  TabItem,
} from '@/components/common/mypage/career/tab/CategoryTabContainer';
import CareerBoard from '@components/career/pages/CareerBoard';

const CareerBoardPage = () => {
  return (
    <main className="flex w-full flex-col px-5 pb-20">
      <CategoryTabContainer tabs={tabs} defaultTab="board" />
    </main>
  );
};

export default CareerBoardPage;

const tabs: TabItem[] = [
  {
    id: 'board',
    label: '커리어 보드',
    content: <CareerBoard />,
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
