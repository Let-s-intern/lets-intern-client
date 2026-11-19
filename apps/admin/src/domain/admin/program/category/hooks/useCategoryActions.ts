import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import {
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
} from '../programCategoryApi';
import { moveAmong, moveId } from '../utils/placementUtils';

/** 노출 목록·카테고리 줄의 이름 변경·숨김·순서·삭제·추가. 어느 탭에서 하든 같은 요청을 보낸다 */
export const useCategoryActions = () => {
  const { snackbar } = useAdminSnackbar();
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

  return {
    createGroup: (title: string) => run(createGroup.mutateAsync({ title })),
    renameGroup: (id: number, title: string) =>
      run(updateGroup.mutateAsync({ id, title })),
    toggleGroup: (id: number, isVisible: boolean) =>
      run(updateGroup.mutateAsync({ id, isVisible })),
    moveGroup: (groupIds: number[], index: number, direction: -1 | 1) =>
      run(reorderGroups.mutateAsync(moveId(groupIds, index, direction))),
    /** 보이는 목록(visibleIds) 안에서만 위·아래로 움직인다 */
    moveGroupAmong: (
      groupIds: number[],
      visibleIds: number[],
      id: number,
      direction: -1 | 1,
    ) =>
      run(
        reorderGroups.mutateAsync(
          moveAmong(groupIds, visibleIds, id, direction),
        ),
      ),
    // 안에 카테고리가 있을 때만 한 번 더 묻는다
    deleteGroup: (group: ProgramCategoryGroup) => {
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
    },
    createCategory: (programCategoryGroupId: number, title: string) =>
      run(createCategory.mutateAsync({ programCategoryGroupId, title })),
    renameCategory: (id: number, title: string) =>
      run(updateCategory.mutateAsync({ id, title })),
    toggleCategory: (id: number, isVisible: boolean) =>
      run(updateCategory.mutateAsync({ id, isVisible })),
    moveCategory: (
      group: ProgramCategoryGroup,
      index: number,
      direction: -1 | 1,
    ) =>
      run(
        reorderCategories.mutateAsync({
          programCategoryGroupId: group.id,
          programCategoryIdList: moveId(
            group.categoryList.map((c) => c.id),
            index,
            direction,
          ),
        }),
      ),
    // 연결된 프로그램이 있을 때만 한 번 더 묻는다
    deleteCategory: (category: ProgramCategory) => {
      if (
        category.programCount > 0 &&
        !window.confirm(
          `"${category.title}" 카테고리는 프로그램 ${category.programCount}개에 연결돼 있습니다. 연결도 함께 지워집니다. 삭제할까요?`,
        )
      )
        return;
      run(deleteCategory.mutateAsync(category.id));
    },
  };
};

export type CategoryActions = ReturnType<typeof useCategoryActions>;
