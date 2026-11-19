import { useState } from 'react';
import { siteUrl } from '../constants/webMenu';
import type { CategoryActions } from '../hooks/useCategoryActions';
import {
  displayTypeLabel,
  type ProgramCategoryGroup,
} from '../programCategoryApi';
import CategoryRowList from '../ui/CategoryRowList';
import LandingPreview from '../ui/LandingPreview';
import SectionEditor from '../ui/SectionEditor';
import { landingPagesOf, menuEntriesTo } from '../utils/placementUtils';
import AddLandingPage from './AddLandingPage';
import LandingPageSettings from './LandingPageSettings';

const pageKey = (groupId: number, placementIndex: number) =>
  `${groupId}:${placementIndex}`;

/** 카테고리 랜딩 페이지. 왼쪽에서 페이지를 고르고, 섹션을 순서대로 고치며 오른쪽 미리보기로 확인한다 */
const LandingPagesTab = ({
  groups,
  actions,
}: {
  groups: ProgramCategoryGroup[];
  actions: CategoryActions;
}) => {
  const pages = landingPagesOf(groups);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const page =
    pages.find((p) => pageKey(p.group.id, p.placementIndex) === selectedKey) ??
    pages[0];

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
      <aside className="flex flex-col gap-3">
        <nav aria-label="랜딩 페이지 목록" className="flex flex-col gap-1">
          {pages.length === 0 && (
            <p className="text-xsmall14 text-neutral-40">
              아직 랜딩 페이지가 없습니다.
            </p>
          )}
          {pages.map((p) => {
            const key = pageKey(p.group.id, p.placementIndex);
            const selected =
              page && key === pageKey(page.group.id, page.placementIndex);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedKey(key)}
                className={`rounded-xs border px-3 py-2 text-left ${
                  selected
                    ? 'border-primary bg-primary-10'
                    : 'border-neutral-80 bg-white hover:bg-neutral-95'
                }`}
              >
                <span className="block text-xsmall14 font-semibold text-neutral-0">
                  /category/{p.slug}
                </span>
                <span className="block text-xxsmall12 text-neutral-40">
                  {p.group.title} · 섹션 {p.group.categoryList.length}개
                  {p.group.isVisible ? '' : ' · 숨김'}
                </span>
              </button>
            );
          })}
        </nav>
        <AddLandingPage groups={groups} />
      </aside>

      {page && (
        <div
          key={pageKey(page.group.id, page.placementIndex)}
          className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
        >
          <section className="flex min-w-0 flex-col gap-4">
            <header className="flex flex-wrap items-baseline gap-2">
              <h3 className="text-small18 font-bold">/category/{page.slug}</h3>
              <a
                href={siteUrl(`/category/${page.slug}`)}
                target="_blank"
                rel="noreferrer"
                className="text-xsmall14 text-primary hover:underline"
              >
                사이트에서 열기
              </a>
              {!page.group.isVisible && (
                <span className="text-xsmall14 text-red-500">
                  노출 목록이 숨김이라 사이트에 안 보입니다
                </span>
              )}
            </header>
            <p className="text-xsmall14 text-neutral-40">
              {menuEntriesTo(groups, page.slug).length > 0
                ? `들어오는 메뉴: ${menuEntriesTo(groups, page.slug).join(', ')}`
                : '이 페이지로 들어오는 GNB·홈 메뉴가 없습니다. 주소로만 열립니다.'}
            </p>
            <LandingPageSettings page={page} />

            <div className="flex flex-col gap-1">
              <h4 className="font-semibold text-neutral-0">
                섹션 (위에서부터 화면 순서)
              </h4>
              <p className="text-xxsmall12 text-neutral-40">
                줄을 누르면 제목·설명·카드 모양·상품을 한 곳에서 고칩니다.
              </p>
              <CategoryRowList
                group={page.group}
                actions={actions}
                editorHasProducts
                caption={(c) =>
                  `${displayTypeLabel[c.displayType ?? 'AUTO']} · 상품 ${c.programCount}`
                }
                renderEditor={(category, onDone) => (
                  <SectionEditor
                    category={category}
                    groups={groups}
                    onDone={onDone}
                  />
                )}
                emptyText="섹션이 없습니다."
                addPlaceholder="섹션 추가 (예: 이력서 챌린지)"
              />
            </div>
          </section>

          <section className="min-w-0 rounded-sm border border-neutral-80 bg-white p-3">
            <h4 className="mb-2 font-semibold text-neutral-0">미리보기</h4>
            <p className="mb-3 text-xxsmall12 text-neutral-40">
              저장된 설정으로 사이트와 같은 상품을 불러옵니다.
            </p>
            <LandingPreview
              group={page.group}
              mergeChallenges={page.mergeChallenges}
            />
          </section>
        </div>
      )}
    </div>
  );
};

export default LandingPagesTab;
