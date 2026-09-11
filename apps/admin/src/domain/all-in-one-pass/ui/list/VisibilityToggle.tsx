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
  /** 이미 노출 중인 다른 패스가 있는지 (단일 노출 규칙) */
  hasOtherVisible: boolean;
}

/** 노출 여부 토글. 단일 노출: 다른 패스가 노출 중이면 켜지 않고 안내만 한다. */
export default function VisibilityToggle({ pass, hasOtherVisible }: Props) {
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();
  const [loading, setLoading] = useState(false);

  const patchVisible = usePatchAllInOnePassVisibleMutation({
    successCallback: () =>
      queryClient.invalidateQueries({ queryKey: [allInOnePassListQueryKey] }),
  });

  const handleChange = async (checked: boolean) => {
    if (checked && hasOtherVisible) {
      snackbar('노출 중인 올인원패스가 존재합니다.');
      return;
    }
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
