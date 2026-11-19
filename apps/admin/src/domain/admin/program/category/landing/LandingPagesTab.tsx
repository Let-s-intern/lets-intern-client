import { Button } from '@mui/material';
import { useState } from 'react';
import { siteUrl } from '../constants/webMenu';
import type { CategoryActions } from '../hooks/useCategoryActions';
import { CARD_STYLE_LABEL, cardStyleOf } from '../constants/cardStyle';
import type { ProgramCategoryGroup } from '../programCategoryApi';
import CategoryRowList from '../ui/CategoryRowList';
import LandingPreview from '../preview/ui/LandingPreview';
import SectionEditor from '../ui/SectionEditor';
import {
  landingPagesOf,
  menuEntriesTo,
  type LandingPage,
} from '../utils/placementUtils';
import AddLandingDialog from './AddLandingDialog';
import LandingSettingsDialog from './LandingSettingsDialog';

const pageKey = (p: LandingPage) => `${p.group.id}:${p.placementIndex}`;

const STEPS = ['페이지 고르기', '섹션 만들기', '상품 넣기'] as const;

/** ① 페이지 고르기 → ② 섹션 만들기 → ③ 상품 넣기. 지금 할 단계를 굵게 */
const StepIndicator = ({ current }: { current: 0 | 1 | 2 }) => (
  <ol className="flex flex-wrap items-center gap-2 text-xsmall14">
    {STEPS.map((label, i) => (
      <li key={label} className="flex items-center gap-2">
        {i > 0 && <span className="text-neutral-60">→</span>}
        <span
          className={
            i === current
              ? 'font-semibold text-neutral-0'
              : i < current
                ? 'text-neutral-40'
                : 'text-neutral-50'
          }
        >
          {'①②③'[i]} {label}
        </span>
      </li>
    ))}
  </ol>
);

const VIEWS = [
  { key: 'edit', label: '편집' },
  { key: 'preview', label: '미리보기' },
] as const;

/** 고른 랜딩 페이지 하나. 머리 줄 한 줄, 그 아래 편집 | 미리보기 */
const LandingPageEditor = ({
  page,
  groups,
  actions,
}: {
  page: LandingPage;
  groups: ProgramCategoryGroup[];
  actions: CategoryActions;
}) => {
  const [view, setView] = useState<(typeof VIEWS)[number]['key']>('edit');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const entries = menuEntriesTo(groups, page.slug);

  return (
    <section className="flex min-w-0 flex-col gap-3">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h3 className="text-small18 font-bold">/category/{page.slug}</h3>
        <a
          href={siteUrl(`/category/${page.slug}`)}
          target="_blank"
          rel="noreferrer"
          className="text-xsmall14 text-primary hover:underline"
        >
          사이트에서 열기
        </a>
        <Button size="small" onClick={() => setSettingsOpen(true)}>
          페이지 설정
        </Button>
        <span className="text-xxsmall12 text-neutral-40">
          {!page.group.isVisible
            ? '노출 목록이 숨김이라 사이트에 안 보입니다'
            : entries.length > 0
              ? `메뉴: ${entries.join(', ')}`
              : '들어오는 메뉴 없음'}
        </span>
      </header>
      {settingsOpen && (
        <LandingSettingsDialog
          page={page}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      <div className="flex gap-4 border-b border-neutral-90">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setView(v.key)}
            className={`-mb-px border-b-2 pb-1.5 text-xsmall14 font-semibold ${
              view === v.key
                ? 'border-neutral-0 text-neutral-0'
                : 'border-transparent text-neutral-40'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === 'edit' ? (
        <CategoryRowList
          group={page.group}
          actions={actions}
          editorHasProducts
          itemLabel="섹션"
          caption={(c) =>
            `${CARD_STYLE_LABEL[cardStyleOf(c.displayType)]} · 상품 ${c.programCount}`
          }
          renderEditor={(category, onDone) => (
            <SectionEditor
              category={category}
              groups={groups}
              onDone={onDone}
            />
          )}
          emptyText="아직 섹션이 없어요. '+ 섹션 추가'로 첫 섹션을 만들면 페이지 위에서부터 차례로 보여요."
          addPlaceholder="섹션 이름 (예: 이력서 챌린지)"
        />
      ) : (
        <LandingPreview
          group={page.group}
          slug={page.slug}
          mergeChallenges={page.mergeChallenges}
        />
      )}
    </section>
  );
};

/** 카테고리 랜딩 페이지. 왼쪽 좁은 목록에서 페이지를 고르고 오른쪽에서 고친다 */
const LandingPagesTab = ({
  groups,
  actions,
}: {
  groups: ProgramCategoryGroup[];
  actions: CategoryActions;
}) => {
  const pages = landingPagesOf(groups);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const page = pages.find((p) => pageKey(p) === selectedKey) ?? pages[0];
  const step = !page ? 0 : page.group.categoryList.length === 0 ? 1 : 2;

  return (
    <div className="mt-4 flex flex-col gap-4">
      <StepIndicator current={step} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-1">
          <nav aria-label="랜딩 페이지 목록" className="flex flex-col">
            {pages.map((p) => (
              <button
                key={pageKey(p)}
                type="button"
                onClick={() => setSelectedKey(pageKey(p))}
                className={`rounded-xs px-3 py-1.5 text-left ${
                  page && pageKey(p) === pageKey(page)
                    ? 'bg-neutral-95 font-semibold text-neutral-0'
                    : 'text-neutral-20 hover:bg-neutral-95'
                }`}
              >
                <span className="block truncate text-xsmall14">
                  /category/{p.slug}
                </span>
                <span className="block truncate text-xxsmall12 font-normal text-neutral-40">
                  {p.group.title}
                  {p.group.isVisible ? '' : ' · 숨김'}
                </span>
              </button>
            ))}
          </nav>
          <Button
            size="small"
            onClick={() => setAdding(true)}
            sx={{ justifyContent: 'flex-start' }}
          >
            + 랜딩 페이지 추가
          </Button>
          {adding && (
            <AddLandingDialog
              groups={groups}
              onClose={() => setAdding(false)}
            />
          )}
        </aside>

        {page ? (
          <LandingPageEditor
            key={pageKey(page)}
            page={page}
            groups={groups}
            actions={actions}
          />
        ) : (
          <p className="text-xsmall14 text-neutral-40">
            아직 랜딩 페이지가 없습니다. 왼쪽에서 추가하세요.
          </p>
        )}
      </div>
    </div>
  );
};

export default LandingPagesTab;
