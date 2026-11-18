import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Fragment, useState } from 'react';
import {
  useAdminProgramCategoryGroupsQuery,
  useCreateProgramCategory,
  useCreateProgramCategoryGroup,
  useDeleteProgramCategory,
  useDeleteProgramCategoryGroup,
  useReorderProgramCategories,
  useReorderProgramCategoryGroups,
  useUpdateProgramCategory,
  useUpdateProgramCategoryGroup,
  displayTypeLabel,
  programCategoryTargetTypeLabel,
  type ProgramCategory,
  type ProgramCategoryGroup,
  type ProgramCategoryPlacement,
} from './programCategoryApi';
import ProgramCategoryPlacementOverview from './ProgramCategoryPlacementOverview';
import { AddRow, ItemRow } from './ProgramCategoryRows';
import ProgramCategoryApiGuideDialog from './ProgramCategoryApiGuideDialog';
import {
  CategorySettingsPanel,
  GroupSettingsPanel,
} from './ProgramCategorySettingsPanels';
import ProgramCategoryTargetList from './ProgramCategoryTargetList';

/** 노출 위치 한 줄 요약. 예: "랜딩 /category/resume", "전체 프로그램 필터 · 하나라도" */
const placementCaption = (p: ProgramCategoryPlacement) => {
  const merge = p.mergeChallenges === false ? ' · 챌린지 기수별' : '';
  return p.placementType === 'LANDING'
    ? `랜딩 /category/${p.slug ?? '?'}${merge}`
    : `전체 프로그램 필터 · ${p.matchMode === 'ALL' ? '모두' : '하나라도'}${merge}`;
};

const PAGE_TABS = [
  { key: 'manage', label: '노출 분류 관리' },
  { key: 'overview', label: '노출 위치별 확인' },
] as const;

const moveId = (ids: number[], index: number, direction: -1 | 1) => {
  const next = [...ids];
  [next[index], next[index + direction]] = [
    next[index + direction],
    next[index],
  ];
  return next;
};

/** 노출 분류 관리. 노출 목록마다 카드 하나로 카테고리까지 전부 펼쳐 보여준다 */
const ProgramCategoryPage = () => {
  const { snackbar } = useAdminSnackbar();
  // 연결 목록을 펼친 카테고리. 한 번에 하나만 연다
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);
  // 설정을 연 행. 'g-1'(노출 목록) / 'c-3'(카테고리)
  const [settingsKey, setSettingsKey] = useState<string | null>(null);
  const toggleSettings = (key: string) =>
    setSettingsKey((prev) => (prev === key ? null : key));
  const [apiGuideOpen, setApiGuideOpen] = useState(false);
  const [tab, setTab] = useState<(typeof PAGE_TABS)[number]['key']>('manage');
  const { data: groups = [], isLoading } = useAdminProgramCategoryGroupsQuery();

  const createGroup = useCreateProgramCategoryGroup();
  const updateGroup = useUpdateProgramCategoryGroup();
  const reorderGroups = useReorderProgramCategoryGroups();
  const deleteGroup = useDeleteProgramCategoryGroup();
  const createCategory = useCreateProgramCategory();
  const updateCategory = useUpdateProgramCategory();
  const reorderCategories = useReorderProgramCategories();
  const deleteCategory = useDeleteProgramCategory();

  const run = async (task: Promise<unknown>) => {
    try {
      await task;
    } catch {
      snackbar('저장에 실패했습니다.');
    }
  };

  // 안에 카테고리가 있을 때만 한 번 더 묻는다
  const handleDeleteGroup = (group: ProgramCategoryGroup) => {
    const linked = group.categoryList.reduce(
      (sum, c) => sum + c.programCount,
      0,
    );
    if (
      group.categoryList.length > 0 &&
      !window.confirm(
        `"${group.title}" 노출 목록을 지우면 안의 카테고리 ${group.categoryList.length}개와 프로그램 연결 ${linked}건도 함께 지워집니다. 삭제할까요?`,
      )
    )
      return;
    run(deleteGroup.mutateAsync(group.id));
  };

  // 연결된 프로그램이 있을 때만 한 번 더 묻는다
  const handleDeleteCategory = (category: ProgramCategory) => {
    if (
      category.programCount > 0 &&
      !window.confirm(
        `"${category.title}" 카테고리는 프로그램 ${category.programCount}개에 연결돼 있습니다. 연결도 함께 지워집니다. 삭제할까요?`,
      )
    )
      return;
    run(deleteCategory.mutateAsync(category.id));
  };

  const groupIds = groups.map((group) => group.id);
  const categoryTitleOf = new Map(
    groups.flatMap((g) => g.categoryList.map((c) => [c.id, c.title] as const)),
  );

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>노출 분류</Heading>
      </Header>
      <nav className="mt-3 flex gap-4 border-b border-neutral-80">
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
      </nav>
      {tab === 'overview' ? (
        <ProgramCategoryPlacementOverview groups={groups} />
      ) : (
        <>
          <p className="mt-3 text-xsmall14 text-neutral-40">
            노출 목록 = 상품 묶음, 카테고리 = 그 안의 항목입니다. 노출 목록의
            톱니(⚙)에서 어디에 보일지(랜딩 페이지·전체 프로그램 필터)를 여러 개
            붙이고, 카테고리 톱니에서 랜딩 섹션 표시 방식·설명·함께 보일
            카테고리를 정합니다. 상품은 각 상품 수정 화면의 &quot;노출
            분류&quot;에서 체크하고, 카테고리를 누르면 연결된 상품이 펼쳐집니다.
          </p>
          <button
            type="button"
            onClick={() => setApiGuideOpen(true)}
            className="mb-6 mt-1 flex items-center gap-1 text-xsmall14 text-primary hover:underline"
          >
            <span
              aria-hidden
              className="flex h-4 w-4 items-center justify-center rounded-full border border-primary text-[11px] font-semibold leading-none"
            >
              i
            </span>
            프론트에서 노출 분류를 불러오는 API
          </button>
          <ProgramCategoryApiGuideDialog
            open={apiGuideOpen}
            onClose={() => setApiGuideOpen(false)}
            groups={groups}
          />

          {isLoading ? (
            <p>loading...</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {groups.map((group, groupIndex) => {
                const categoryIds = group.categoryList.map((c) => c.id);
                return (
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
                        onRename={(title) =>
                          run(updateGroup.mutateAsync({ id: group.id, title }))
                        }
                        onToggleVisible={(isVisible) =>
                          run(
                            updateGroup.mutateAsync({
                              id: group.id,
                              isVisible,
                            }),
                          )
                        }
                        onMove={(direction) =>
                          run(
                            reorderGroups.mutateAsync(
                              moveId(groupIds, groupIndex, direction),
                            ),
                          )
                        }
                        onDelete={() => handleDeleteGroup(group)}
                        onSettings={() => toggleSettings(`g-${group.id}`)}
                      />
                      {settingsKey === `g-${group.id}` && (
                        <li>
                          <GroupSettingsPanel
                            group={group}
                            onDone={() => setSettingsKey(null)}
                          />
                        </li>
                      )}
                    </ul>
                    <ul className="mt-2 flex flex-col gap-0.5 pl-4">
                      {group.categoryList.map((category, index) => (
                        <Fragment key={category.id}>
                          <ItemRow
                            title={category.title}
                            caption={[
                              category.slug ? `키 ${category.slug}` : null,
                              category.displayType &&
                              category.displayType !== 'AUTO'
                                ? displayTypeLabel[category.displayType]
                                : null,
                              (category.sourceCategoryIds ?? []).length > 0
                                ? `함께: ${(category.sourceCategoryIds ?? [])
                                    .map(
                                      (id) =>
                                        categoryTitleOf.get(id) ?? `#${id}`,
                                    )
                                    .join(', ')}`
                                : null,
                              category.directTargetType &&
                              category.directTargetId
                                ? `바로 → ${programCategoryTargetTypeLabel[category.directTargetType]} #${category.directTargetId}`
                                : null,
                              `연결 ${category.programCount} ${openCategoryId === category.id ? '▲' : '▼'}`,
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                            active={openCategoryId === category.id}
                            onClick={() =>
                              setOpenCategoryId((prev) =>
                                prev === category.id ? null : category.id,
                              )
                            }
                            isVisible={category.isVisible}
                            isFirst={index === 0}
                            isLast={index === group.categoryList.length - 1}
                            onRename={(title) =>
                              run(
                                updateCategory.mutateAsync({
                                  id: category.id,
                                  title,
                                }),
                              )
                            }
                            onToggleVisible={(isVisible) =>
                              run(
                                updateCategory.mutateAsync({
                                  id: category.id,
                                  isVisible,
                                }),
                              )
                            }
                            onMove={(direction) =>
                              run(
                                reorderCategories.mutateAsync({
                                  programCategoryGroupId: group.id,
                                  programCategoryIdList: moveId(
                                    categoryIds,
                                    index,
                                    direction,
                                  ),
                                }),
                              )
                            }
                            onDelete={() => handleDeleteCategory(category)}
                            onSettings={() =>
                              toggleSettings(`c-${category.id}`)
                            }
                          />
                          {settingsKey === `c-${category.id}` && (
                            <li>
                              <CategorySettingsPanel
                                category={category}
                                groups={groups}
                                onDone={() => setSettingsKey(null)}
                              />
                            </li>
                          )}
                          {openCategoryId === category.id && (
                            <li>
                              <ProgramCategoryTargetList
                                categoryId={category.id}
                              />
                            </li>
                          )}
                        </Fragment>
                      ))}
                      {group.categoryList.length === 0 && (
                        <li className="py-2 pl-3 text-xsmall14 text-neutral-40">
                          카테고리가 없습니다.
                        </li>
                      )}
                    </ul>
                    <div className="pl-4">
                      <AddRow
                        placeholder={`${group.title}에 카테고리 추가 (예: 마케팅)`}
                        onAdd={(title) =>
                          run(
                            createCategory.mutateAsync({
                              programCategoryGroupId: group.id,
                              title,
                            }),
                          )
                        }
                      />
                    </div>
                  </section>
                );
              })}

              <section className="rounded-sm border border-dashed border-neutral-80 p-3">
                <p className="mb-1 pl-1 font-semibold text-neutral-10">
                  노출 목록 추가
                </p>
                <AddRow
                  placeholder="새 노출 목록 이름 (예: 관심 직무)"
                  onAdd={(title) => run(createGroup.mutateAsync({ title }))}
                />
              </section>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProgramCategoryPage;
