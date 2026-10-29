import { AllInOnePassNotice } from '@/api/all-in-one-pass/allInOnePassSchema';
import {
  allInOnePassNoticeListQueryKey,
  useUpdateAllInOnePassNoticeExposureMutation,
} from '@/api/all-in-one-pass/useNoticeList';
import ExposureModal from '@/domain/all-in-one-pass/ui/ExposureModal';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  /** 대상 공지. null 이면 모달 닫힘 */
  notice: AllInOnePassNotice | null;
  onClose: () => void;
}

/** 공지/가이드 노출 영역 관리 (ExposureModal + 공지 노출 PATCH) */
export default function NoticeExposureModal({ notice, onClose }: Props) {
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();

  const updateExposure = useUpdateAllInOnePassNoticeExposureMutation({
    successCallback: () =>
      queryClient.invalidateQueries({
        queryKey: [allInOnePassNoticeListQueryKey],
      }),
  });

  const handleSave = async (membershipIds: number[]) => {
    if (!notice) return;
    try {
      await updateExposure.mutateAsync({
        membershipNoticeId: notice.id,
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
      open={notice !== null}
      initialSelectedIds={notice?.membershipIds ?? []}
      isSaving={updateExposure.isPending}
      onSave={handleSave}
      onClose={onClose}
    />
  );
}
