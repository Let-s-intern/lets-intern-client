import { clsx } from 'clsx';
import { useState } from 'react';

interface GuideItem {
  id: number;
  title: string;
  isNew?: boolean;
}

const DashboardGuidePage = () => {
  const [activeTab, setActiveTab] = useState<'notice' | 'guide'>('notice');

  const noticeItems: GuideItem[] = [
    {
      id: 1,
      title:
        '[프리미엄, 스탠다드 옵션 대상자] 스탠다드, 프리미엄 옵션 피드백 안내',
      isNew: true,
    },
    {
      id: 2,
      title: '[LIVE 세션] 마케팅 서류 완성 패키지_3기] LIVE 안내',
    },
    {
      id: 3,
      title: '필독[질문하고 싶다면, 여기서!',
    },
    {
      id: 4,
      title: '필독[질문하고 싶다면, 여기서!',
    },
  ];

  const guideItems: GuideItem[] = [
    {
      id: 1,
      title: '페이백 정책',
      isNew: true,
    },
    {
      id: 2,
      title: '대시보드 이용 방법',
    },
    {
      id: 3,
      title: '미션 수행 및 인증 방법',
    },
  ];

  const currentItems = activeTab === 'notice' ? noticeItems : guideItems;

  return (
    <main>
      {/* 헤더 */}
      <header className="mb-6">
        <h1 className="text-medium22 font-bold text-neutral-0">
          공지사항 / 챌린지 가이드
        </h1>
      </header>

      {/* 탭 네비게이션 */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('notice')}
          className={clsx(
            'rounded-full px-4 py-1.5 text-xsmall16 font-medium transition-colors',
            activeTab === 'notice'
              ? 'bg-neutral-10 text-white'
              : 'bg-neutral-95 text-neutral-40 hover:bg-neutral-90',
          )}
        >
          공지사항
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={clsx(
            'text-16 rounded-full px-4 py-1.5 font-medium transition-colors',
            activeTab === 'guide'
              ? 'bg-neutral-10 text-white'
              : 'bg-neutral-95 text-neutral-40 hover:bg-neutral-90',
          )}
        >
          챌린지 가이드
        </button>
      </div>

      {/* 리스트 */}
      <div className="space-y-0">
        {currentItems.map((item, index) => (
          <div key={item.id} className="hover:bg-neutral-90">
            <button className="flex items-center justify-between py-3">
              <span className="mr-1.5 text-small18 font-medium text-neutral-10">
                {item.title}
              </span>
              {item.isNew && (
                <div className="flex h-3 w-3 items-center justify-center rounded-full bg-red-500">
                  <span className="text-[8px] font-bold text-white">N</span>
                </div>
              )}
            </button>
            {index < currentItems.length - 1 && (
              <div className="h-px bg-neutral-80" />
            )}
          </div>
        ))}
      </div>
    </main>
  );
};

export default DashboardGuidePage;
