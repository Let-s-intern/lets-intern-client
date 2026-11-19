import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { PLACEMENT_SAVE_FAILED } from '../constants/wording';
import { useUpdateProgramCategoryPlacements } from '../programCategoryApi';
import { toPlacementInput, type PlacementDraft } from '../utils/placementUtils';

/** 노출 위치를 통째로 저장한다. 성공하면 true */
export const useSavePlacements = () => {
  const { snackbar } = useAdminSnackbar();
  const update = useUpdateProgramCategoryPlacements();
  const save = async (groupId: number, drafts: PlacementDraft[]) => {
    try {
      await update.mutateAsync({
        id: groupId,
        placementList: drafts.map(toPlacementInput),
      });
      snackbar('저장했습니다.');
      return true;
    } catch {
      snackbar(PLACEMENT_SAVE_FAILED);
      return false;
    }
  };
  return { save, isPending: update.isPending };
};
