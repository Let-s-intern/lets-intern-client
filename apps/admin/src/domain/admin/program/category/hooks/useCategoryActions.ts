import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import {
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
import { moveAmong, moveId } from '../utils/tagUtils';

/** 노출 목록·카테고리 줄의 이름 변경·숨김·순서·삭제·추가. 어느 탭에서 하든 같은 요청을 보낸다 */
export const useCategoryActions = () => {
  const { snackbar } = useAdminSnackbar();
  const createGroup = useCreateProgramCategoryGroup();
  const updateGroup = useUpdateProgramCategoryGroup();
  const reorderGroups = useReorderProgramCategoryGroups();
  const deleteGroup = useDeleteProgramCategoryGroup();
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
    // 필터 줄 안에 분류가 있으면 서버가 막는다(분류·상품 연결 보호). 먼저 알려 준다
    deleteGroup: (group: ProgramCategoryGroup) => {
      if (group.categoryList.length > 0) {
        snackbar(
          `"${group.title}" 줄에 분류가 ${group.categoryList.length}개 있어요. 다른 줄로 옮긴 뒤 지우세요.`,
        );
        return;
      }
      if (!window.confirm(`"${group.title}" 줄을 지울까요?`)) return;
      run(deleteGroup.mutateAsync(group.id));
    },
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
    // 분류를 지우면 상품 연결과 그 페이지 섹션도 지워진다. 늘 한 번 더 묻는다
    deleteCategory: (category: ProgramCategory) => {
      if (
        !window.confirm(
          `"${category.title}" 분류를 지우면 상품 연결 ${category.programCount}건과 이 분류 페이지의 섹션도 함께 지워집니다. 삭제할까요?`,
        )
      )
        return;
      run(deleteCategory.mutateAsync(category.id));
    },
  };
};

export type CategoryActions = ReturnType<typeof useCategoryActions>;
