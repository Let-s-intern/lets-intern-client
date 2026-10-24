import { AllInOnePassBenefit } from '@/api/all-in-one-pass/allInOnePassSchema';
import {
  allInOnePassBenefitListQueryKey,
  useUpdateAllInOnePassBenefitExposureMutation,
} from '@/api/all-in-one-pass/useBenefits';
import ExposureModal from '@/domain/all-in-one-pass/ui/ExposureModal';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  /** 대상 자료집. null 이면 모달 닫힘 */
  benefit: AllInOnePassBenefit | null;
  onClose: () => void;
}

/** 자료집 노출 영역 관리 (ExposureModal + 자료집 노출 PATCH) */
export default function MaterialExposureModal({ benefit, onClose }: Props) {
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  const updateExposure = useUpdateAllInOnePassBenefitExposureMutation({
    successCallback: () =>
      queryClient.invalidateQueries({
        queryKey: [allInOnePassBenefitListQueryKey],
      }),
  });

  const handleSave = async (membershipIds: number[]) => {
    if (!benefit) return;
    try {
      await updateExposure.mutateAsync({
        membershipBenefitId: benefit.membershipBenefitId,
        membershipIds,
      });
      snackbar('노출 영역이 저장되었습니다.');
      onClose();
    } catch (e) {
      snackbar(e instanceof Error ? e.message : '저장에 실패했습니다.');
    }
  };

  return (
    <ExposureModal
      open={benefit !== null}
      initialSelectedIds={benefit?.membershipIds ?? []}
      isSaving={updateExposure.isPending}
      onSave={handleSave}
      onClose={onClose}
    />
  );
}
