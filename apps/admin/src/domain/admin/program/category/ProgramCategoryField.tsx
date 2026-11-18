import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { useEffect, useRef, useState } from 'react';
import ProgramCategoryPicker from './ProgramCategoryPicker';
import {
  useProgramCategoryIdsQuery,
  usePutProgramCategoriesOfTarget,
  type ProgramCategoryTargetType,
} from './programCategoryApi';

interface ProgramCategoryFieldProps {
  targetType: ProgramCategoryTargetType;
  targetId: number;
}

/**
 * 각 상품 수정 화면의 노출 분류. 체크하면 바로 저장한다. 화면마다 저장 흐름이 달라 거기에 기대지 않는다
 */
const ProgramCategoryField = ({
  targetType,
  targetId,
}: ProgramCategoryFieldProps) => {
  const { snackbar } = useAdminSnackbar();
  const { data: savedIds } = useProgramCategoryIdsQuery(targetType, targetId);
  const putCategories = usePutProgramCategoriesOfTarget(targetType, targetId);

  // 저장은 한 번에 하나만 보낸다. 보내는 동안 바뀐 상태는 끝난 뒤 마지막 것만 한 번 더 보낸다
  const saving = useRef(false);
  const latest = useRef<number[] | null>(null);
  // 화면의 체크 상태는 서버 응답을 기다리지 않고 바로 바꾼다. 연타해도 매번 최신 상태에서 계산한다
  const [selectedIds, setSelectedIds] = useState<number[] | undefined>();
  useEffect(() => {
    if (savedIds && !saving.current) setSelectedIds(savedIds);
  }, [savedIds]);

  const flush = async () => {
    if (saving.current) return;
    saving.current = true;
    try {
      while (latest.current) {
        const next = latest.current;
        latest.current = null;
        await putCategories.mutateAsync(next);
      }
    } catch {
      latest.current = null;
      snackbar(
        '노출 분류 저장에 실패했습니다. 새로고침 후 다시 확인해 주세요.',
      );
    } finally {
      saving.current = false;
    }
  };

  // 지정 목록을 받기 전에는 바꾸지 않는다. 빈 목록으로 덮어써 기존 지정이 지워지는 것을 막는다
  const toggle = (id: number) => {
    if (!selectedIds) return;
    const next = selectedIds.includes(id)
      ? selectedIds.filter((v) => v !== id)
      : [...selectedIds, id];
    setSelectedIds(next);
    latest.current = next;
    void flush();
  };

  return (
    <ProgramCategoryPicker
      selectedIds={selectedIds}
      onToggle={toggle}
      note="체크하면 바로 저장됩니다."
    />
  );
};

export default ProgramCategoryField;
