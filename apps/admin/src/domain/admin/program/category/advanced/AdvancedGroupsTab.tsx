import { useState } from 'react';
import { SOURCES_LABEL } from '../constants/wording';
import type { CategoryActions } from '../hooks/useCategoryActions';
import {
  displayTypeLabel,
  programCategoryTargetTypeLabel,
  type ProgramCategory,
  type ProgramCategoryGroup,
  type ProgramCategoryPlacement,
} from '../programCategoryApi';
import { AddRow, ItemRow } from '../ProgramCategoryRows';
import CategoryRowList from '../ui/CategoryRowList';
import MenuButtonEditor from '../ui/MenuButtonEditor';
import SectionEditor from '../ui/SectionEditor';
import GroupPlacementsEditor from './GroupPlacementsEditor';

/** 노출 위치 한 줄 요약. 예: "랜딩 /category/resume", "전체 프로그램 필터 · 하나라도 해당" */
const placementCaption = (p: ProgramCategoryPlacement) => {
  const merge = p.mergeChallenges === false ? ' · 기수별로 따로' : '';
  return p.placementType === 'LANDING'
    ? `랜딩 /category/${p.slug ?? '?'}${merge}`
    : `전체 프로그램 필터 · ${p.matchMode === 'ALL' ? '모두 해당' : '하나라도 해당'}${merge}`;
};

/**
 * 노출 목록 전체. 목록 추가·삭제와 노출 위치를 여러 개 붙이는 일은 여기서만 한다.
 * 카테고리 톱니에서는 섹션 설정과 메뉴 버튼 설정을 함께 연다
 */
const AdvancedGroupsTab = ({
  groups,
  actions,
}: {
  groups: ProgramCategoryGroup[];
  actions: CategoryActions;
}) => {
  const [placementsGroupId, setPlacementsGroupId] = useState<number | null>(
    null,
  );
  const groupIds = groups.map((g) => g.id);
  const categoryTitleOf = new Map(
    groups.flatMap((g) => g.categoryList.map((c) => [c.id, c.title] as const)),
  );
  const categoryCaption = (category: ProgramCategory) =>
    [
      category.slug ? `/category/${category.slug}` : null,
      category.displayType && category.displayType !== 'AUTO'
        ? displayTypeLabel[category.displayType]
        : null,
      (category.sourceCategoryIds ?? []).length > 0
        ? `${SOURCES_LABEL}: ${(category.sourceCategoryIds ?? [])
            .map((id) => categoryTitleOf.get(id) ?? `#${id}`)
            .join(', ')}`
        : null,
      category.directTargetType && category.directTargetId
        ? `바로 이동 → ${programCategoryTargetTypeLabel[category.directTargetType]} #${category.directTargetId}`
        : null,
      `상품 ${category.programCount}`,
    ]
      .filter(Boolean)
      .join(' · ');

  return (
    <>
      <p className="mb-4 mt-3 text-xsmall14 text-neutral-40">
        노출 목록 = 상품 묶음, 카테고리 = 그 안의 항목입니다. 노출 목록 톱니에서
        어디에 보일지(랜딩 페이지·전체 프로그램 필터)를 여러 개 붙이고, 카테고리
        톱니에서 섹션 설정과 메뉴 버튼 설정을 고칩니다. 평소에는 &quot;카테고리
        랜딩 페이지&quot;·&quot;전체 프로그램 필터&quot; 탭을 쓰면 됩니다.
      </p>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {groups.map((group, groupIndex) => (
          <section
            key={group.id}
            className="rounded-sm border border-neutral-80 bg-white p-3"
          >
            <ul className="border-b border-neutral-80 pb-2">
              <ItemRow
                strong
                title={group.title}
                caption={[
                  ...((group.placements ?? []).length > 0
                    ? (group.placements ?? []).map(placementCaption)
                    : ['노출 위치 없음 (어디에도 안 보임)']),
                  `카테고리 ${group.categoryList.length}개`,
                ].join(' | ')}
                isVisible={group.isVisible}
                isFirst={groupIndex === 0}
                isLast={groupIndex === groups.length - 1}
                onRename={(title) => actions.renameGroup(group.id, title)}
                onToggleVisible={(isVisible) =>
                  actions.toggleGroup(group.id, isVisible)
                }
                onMove={(direction) =>
                  actions.moveGroup(groupIds, groupIndex, direction)
                }
                onDelete={() => actions.deleteGroup(group)}
                onSettings={() =>
                  setPlacementsGroupId((prev) =>
                    prev === group.id ? null : group.id,
                  )
                }
              />
              {placementsGroupId === group.id && (
                <li>
                  <GroupPlacementsEditor
                    group={group}
                    onDone={() => setPlacementsGroupId(null)}
                  />
                </li>
              )}
            </ul>
            <div className="mt-2 pl-4">
              <CategoryRowList
                group={group}
                actions={actions}
                caption={categoryCaption}
                renderEditor={(category, onDone) => (
                  <div className="flex flex-col gap-1">
                    <p className="ml-3 mt-1 text-xsmall14 font-semibold text-neutral-10">
                      랜딩 섹션으로 보일 때
                    </p>
                    <SectionEditor
                      category={category}
                      groups={groups}
                      onDone={onDone}
                    />
                    <p className="ml-3 text-xsmall14 font-semibold text-neutral-10">
                      필터 버튼·메뉴로 쓸 때
                    </p>
                    <MenuButtonEditor category={category} onDone={onDone} />
                  </div>
                )}
                emptyText="카테고리가 없습니다."
                addPlaceholder={`${group.title}에 카테고리 추가 (예: 마케팅)`}
              />
            </div>
          </section>
        ))}

        <section className="rounded-sm border border-dashed border-neutral-80 p-3">
          <p className="mb-1 pl-1 font-semibold text-neutral-10">
            노출 목록 추가
          </p>
          <AddRow
            placeholder="새 노출 목록 이름 (예: 관심 직무)"
            onAdd={actions.createGroup}
          />
        </section>
      </div>
    </>
  );
};

export default AdvancedGroupsTab;
