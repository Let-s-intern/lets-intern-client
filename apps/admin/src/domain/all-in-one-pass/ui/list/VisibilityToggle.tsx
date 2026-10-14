import {
  allInOnePassListQueryKey,
  usePatchAllInOnePassVisibleMutation,
} from '@/api/all-in-one-pass/usePassList';
import { AllInOnePassListItem } from '@/domain/all-in-one-pass/types';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Switch } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface Props {
  pass: AllInOnePassListItem;
}

/** 노출 여부 토글 (다중 동시 노출 허용) */
export default function VisibilityToggle({ pass }: Props) {
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();
  const [loading, setLoading] = useState(false);

  const patchVisible = usePatchAllInOnePassVisibleMutation({
    successCallback: () =>
      queryClient.invalidateQueries({ queryKey: [allInOnePassListQueryKey] }),
  });

  const handleChange = async (checked: boolean) => {
    setLoading(true);
    try {
      await patchVisible.mutateAsync({ id: pass.id, isVisible: checked });
      snackbar(
        `<${pass.title}> 노출여부가 "${checked ? '노출' : '비노출'}"로 변경되었습니다.`,
      );
    } catch (err) {
      snackbar(
        err instanceof Error ? err.message : '노출 변경에 실패했습니다.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      checked={pass.isVisible}
      disabled={loading}
      onChange={(e) => handleChange(e.target.checked)}
    />
  );
}
