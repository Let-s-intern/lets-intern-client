import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
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
  type ProgramCategory,
  type ProgramCategoryGroup,
} from './programCategoryApi';
import { AddRow, ItemRow } from './ProgramCategoryRows';

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

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>노출 분류</Heading>
      </Header>
      <p className="mb-6 mt-2 text-xsmall14 text-neutral-40">
        노출 목록은 프로그램 목록 필터의 제목 줄, 카테고리는 그 아래 체크박스가
        됩니다. 프로그램은 챌린지·LIVE·VOD 수정 화면의 "노출 분류" 에서
        체크합니다. 잠시 빼 두려면 숨김, 아예 없애려면 삭제를 씁니다.
      </p>

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
                    caption={`카테고리 ${group.categoryList.length}개`}
                    isVisible={group.isVisible}
                    isFirst={groupIndex === 0}
                    isLast={groupIndex === groups.length - 1}
                    onRename={(title) =>
                      run(updateGroup.mutateAsync({ id: group.id, title }))
                    }
                    onToggleVisible={(isVisible) =>
                      run(updateGroup.mutateAsync({ id: group.id, isVisible }))
                    }
                    onMove={(direction) =>
                      run(
                        reorderGroups.mutateAsync(
                          moveId(groupIds, groupIndex, direction),
                        ),
                      )
                    }
                    onDelete={() => handleDeleteGroup(group)}
                  />
                </ul>
                <ul className="mt-2 flex flex-col gap-0.5 pl-4">
                  {group.categoryList.map((category, index) => (
                    <ItemRow
                      key={category.id}
                      title={category.title}
                      caption={`연결 ${category.programCount}`}
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
                    />
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
    </div>
  );
};

export default ProgramCategoryPage;
