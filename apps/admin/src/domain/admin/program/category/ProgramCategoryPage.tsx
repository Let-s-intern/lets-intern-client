import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useState } from 'react';
import AdvancedGroupsTab from './advanced/AdvancedGroupsTab';
import ProgramFilterTab from './filter/ProgramFilterTab';
import { useCategoryActions } from './hooks/useCategoryActions';
import LandingPagesTab from './landing/LandingPagesTab';
import CheckTab from './overview/CheckTab';
import { useAdminProgramCategoryGroupsQuery } from './programCategoryApi';
import ProgramCategoryApiGuideDialog from './ProgramCategoryApiGuideDialog';
import GuideDialog from './ui/GuideDialog';
import { hasSeenGuide, markGuideSeen } from './utils/guideSeen';

const PAGE_TABS = [
  { key: 'landing', label: '카테고리 랜딩 페이지' },
  { key: 'filter', label: '전체 프로그램 필터' },
  { key: 'check', label: '점검' },
  { key: 'advanced', label: '고급 설정' },
] as const;

type PageTab = (typeof PAGE_TABS)[number]['key'];

/**
 * 노출 분류. 쓰임새별로 탭을 나눈다. 랜딩 페이지와 전체 프로그램 필터는 각자 탭에서 고치고,
 * 노출 목록 전체와 노출 위치 여러 개 붙이기는 고급 설정에 둔다
 */
const ProgramCategoryPage = () => {
  const [apiGuideOpen, setApiGuideOpen] = useState(false);
  // 처음 들어왔을 때 한 번 저절로 뜬다
  const [guideOpen, setGuideOpen] = useState(() => !hasSeenGuide());
  const closeGuide = () => {
    markGuideSeen();
    setGuideOpen(false);
  };
  const [tab, setTab] = useState<PageTab>('landing');
  const { data: groups = [], isLoading } = useAdminProgramCategoryGroupsQuery();
  const actions = useCategoryActions();

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>노출 분류</Heading>
      </Header>
      <nav className="mt-3 flex flex-wrap items-end gap-4 border-b border-neutral-80">
        {PAGE_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-1 pb-2 text-xsmall16 font-semibold ${
              tab === t.key
                ? 'border-neutral-0 text-neutral-0'
                : 'border-transparent text-neutral-40'
            }`}
          >
            {t.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setGuideOpen(true)}
          className="mb-2 ml-auto rounded-xs border border-neutral-80 px-2.5 py-0.5 text-xsmall14 font-semibold text-neutral-10 hover:bg-neutral-95"
        >
          사용법
        </button>
        <button
          type="button"
          onClick={() => setApiGuideOpen(true)}
          className="mb-2 flex items-center gap-1 text-xsmall14 text-primary hover:underline"
        >
          <span
            aria-hidden
            className="flex h-4 w-4 items-center justify-center rounded-full border border-primary text-[11px] font-semibold leading-none"
          >
            i
          </span>
          프론트에서 노출 분류를 불러오는 API
        </button>
      </nav>
      {guideOpen && <GuideDialog onClose={closeGuide} />}
      <ProgramCategoryApiGuideDialog
        open={apiGuideOpen}
        onClose={() => setApiGuideOpen(false)}
        groups={groups}
      />
      {isLoading ? (
        <p className="mt-4">loading...</p>
      ) : (
        <>
          {tab === 'landing' && (
            <LandingPagesTab groups={groups} actions={actions} />
          )}
          {tab === 'filter' && (
            <ProgramFilterTab groups={groups} actions={actions} />
          )}
          {tab === 'check' && <CheckTab groups={groups} />}
          {tab === 'advanced' && (
            <AdvancedGroupsTab groups={groups} actions={actions} />
          )}
        </>
      )}
    </div>
  );
};

export default ProgramCategoryPage;
