import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import {
  useAdminProgramCategoryGroupsQuery,
  useProgramCategoryIdsQuery,
  usePutProgramCategoriesOfTarget,
  type ProgramCategoryTargetType,
} from './programCategoryApi';

interface ProgramCategoryFieldProps {
  targetType: ProgramCategoryTargetType;
  targetId: number;
}

/**
 * 각 상품 수정 화면의 노출 분류. 평소에는 고른 카테고리만 한 줄로 보이고 "수정" 을 눌러 펼친다.
 * 체크하면 바로 저장한다. 화면마다 저장 흐름이 달라 거기에 기대지 않는다
 */
const ProgramCategoryField = ({
  targetType,
  targetId,
}: ProgramCategoryFieldProps) => {
  const { snackbar } = useAdminSnackbar();
  const { data: groups = [] } = useAdminProgramCategoryGroupsQuery();
  const { data: savedIds } = useProgramCategoryIdsQuery(targetType, targetId);
  const putCategories = usePutProgramCategoriesOfTarget(targetType, targetId);
  const [expanded, setExpanded] = useState(false);

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

  const selected = groups.flatMap((group) =>
    group.categoryList
      .filter((category) => selectedIds?.includes(category.id))
      .map((category) => ({ group, category })),
  );

  return (
    <div className="rounded-xs border border-neutral-80 px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xsmall14 font-semibold text-neutral-0">
          노출 분류
        </span>
        {selected.length === 0 ? (
          <span className="text-xsmall14 text-neutral-40">지정 안 됨</span>
        ) : (
          selected.map(({ group, category }) => (
            <span
              key={category.id}
              className="rounded-xs bg-neutral-95 px-2 py-0.5 text-xsmall14 text-neutral-10"
            >
              {group.title} · {category.title}
              {(!group.isVisible || !category.isVisible) && ' (숨김)'}
            </span>
          ))
        )}
        <Button
          size="small"
          sx={{ ml: 'auto' }}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? '접기' : '수정'}
        </Button>
      </div>

      {expanded &&
        (groups.length === 0 ? (
          <p className="mt-2 text-xsmall14 text-neutral-40">
            노출 분류가 없습니다. 사이드바 프로그램 관리의 "노출 분류"에서 먼저
            추가하세요.
          </p>
        ) : (
          <div className="mt-2 flex flex-col gap-2 border-t border-neutral-80 pt-2">
            <p className="text-xsmall14 text-neutral-40">
              체크하면 바로 저장됩니다.
            </p>
            {groups.map((group) => (
              <div key={group.id}>
                <p className="text-xsmall14 font-semibold text-neutral-0">
                  {group.title}
                  {!group.isVisible && ' (숨김)'}
                </p>
                <div className="flex flex-wrap">
                  {group.categoryList.map((category) => (
                    <FormControlLabel
                      key={category.id}
                      control={
                        <Checkbox
                          size="small"
                          disabled={!selectedIds}
                          checked={selectedIds?.includes(category.id) ?? false}
                          onChange={() => toggle(category.id)}
                        />
                      }
                      label={`${category.title}${category.isVisible ? '' : ' (숨김)'}`}
                    />
                  ))}
                  {group.categoryList.length === 0 && (
                    <span className="text-xsmall14 text-neutral-40">
                      카테고리 없음
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default ProgramCategoryField;
