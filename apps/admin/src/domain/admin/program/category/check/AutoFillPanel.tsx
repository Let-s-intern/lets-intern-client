import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useAllProducts, type AutoTagProduct } from '../hooks/useAllProducts';
import {
  fetchProgramCategoryIds,
  programCategoryTargetTypeLabel,
  putProgramCategoriesOfTarget,
  type ProgramCategoryGroup,
} from '../programCategoryApi';
import { planAutoFill } from '../utils/autoTag';
import { autoTagRulesOf } from '../utils/tagUtils';

const keyOf = (p: { targetType?: string; targetId?: number }) =>
  `${p.targetType}-${p.targetId}`;

/**
 * 일괄 자동 태그: 상품 × 더할 태그를 이유와 함께 보여 주고, 고른 것만 더한다. 있는 태그는 빼지 않는다.
 * 더하기 직전에 그 상품의 지금 태그를 다시 읽어 합친다(저장 API 가 통째 교체라서)
 */
const AutoFillDialog = ({
  groups,
  onClose,
}: {
  groups: ProgramCategoryGroup[];
  onClose: () => void;
}) => {
  const { snackbar } = useAdminSnackbar();
  const queryClient = useQueryClient();
  const { data, isLoading } = useAllProducts();
  const plan = useMemo(
    () =>
      data ? planAutoFill(data, autoTagRulesOf(groups), (p) => p.tagIds) : [],
    [data, groups],
  );
  // 기본은 모두 고름. 고른 것을 "상품키:태그id" 로 둔다
  const [unchecked, setUnchecked] = useState<Set<string>>(new Set());
  const [applying, setApplying] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const pickKey = (p: AutoTagProduct, tagId: number) => `${keyOf(p)}:${tagId}`;
  const selectedCount = plan.reduce(
    (n, r) =>
      n +
      r.adds.filter((a) => !unchecked.has(pickKey(r.product, a.tagId))).length,
    0,
  );
  const toggle = (k: string) =>
    setUnchecked((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const apply = async () => {
    const rows = plan
      .map((r) => ({
        product: r.product,
        tagIds: r.adds
          .filter((a) => !unchecked.has(pickKey(r.product, a.tagId)))
          .map((a) => a.tagId),
      }))
      .filter((r) => r.tagIds.length > 0);
    let failed = 0;
    setApplying({ done: 0, total: rows.length });
    for (const [i, row] of rows.entries()) {
      try {
        const current = await fetchProgramCategoryIds(
          row.product.targetType,
          row.product.targetId,
        );
        const next = [...new Set([...current, ...row.tagIds])];
        if (next.length !== current.length)
          await putProgramCategoriesOfTarget(
            row.product.targetType,
            row.product.targetId,
            next,
          );
      } catch {
        failed += 1;
      }
      setApplying({ done: i + 1, total: rows.length });
    }
    await queryClient.invalidateQueries();
    snackbar(
      failed
        ? `${rows.length - failed}개 더했고 ${failed}개는 실패했어요.`
        : `${rows.length}개 상품에 태그를 더했어요.`,
    );
    onClose();
  };

  return (
    <Dialog
      open
      onClose={applying ? undefined : onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>자동 태그 채우기</DialogTitle>
      <DialogContent className="flex flex-col gap-3">
        <p className="text-xxsmall12 text-neutral-40">
          태그 키워드·챌린지 구분·블로그 해시태그·멘토링 분류로 더할 태그만
          골랐어요. 이미 있는 태그는 빼고 보여 주고, 있는 태그를 지우지는
          않아요.
        </p>
        {isLoading ? (
          <p className="text-xsmall14 text-neutral-40">상품을 불러오는 중…</p>
        ) : plan.length === 0 ? (
          <p className="text-xsmall14 text-neutral-40">더할 태그가 없어요.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-neutral-90">
            {plan.map(({ product, adds }) => (
              <li key={keyOf(product)} className="py-2">
                <p className="text-xsmall14 font-semibold text-neutral-10">
                  <span className="mr-1.5 rounded-xs bg-neutral-95 px-1.5 text-xxsmall12 font-normal text-neutral-40">
                    {programCategoryTargetTypeLabel[product.targetType]}
                  </span>
                  {product.title}
                </p>
                <div className="mt-1 flex flex-col">
                  {adds.map((a) => {
                    const k = pickKey(product, a.tagId);
                    return (
                      <label
                        key={k}
                        className="flex items-center gap-1 text-xsmall14"
                      >
                        <Checkbox
                          size="small"
                          checked={!unchecked.has(k)}
                          onChange={() => toggle(k)}
                        />
                        <span className="font-semibold">+ {a.tagTitle}</span>
                        <span className="text-xxsmall12 text-neutral-40">
                          {a.reasons.join(' · ')}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
      <DialogActions>
        {applying && (
          <span className="mr-auto text-xsmall14 text-neutral-40">
            {applying.done} / {applying.total}
          </span>
        )}
        <Button onClick={onClose} disabled={Boolean(applying)}>
          닫기
        </Button>
        <Button
          variant="contained"
          disabled={selectedCount === 0 || Boolean(applying)}
          onClick={apply}
        >
          {selectedCount}개 더하기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/** 점검 탭 위의 버튼 하나. 누르면 미리보기 창이 열린다 */
const AutoFillPanel = ({ groups }: { groups: ProgramCategoryGroup[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xs bg-neutral-95 px-4 py-3">
      <span className="text-xsmall14 text-neutral-10">
        상품 제목·구분으로 태그를 자동으로 채워요. 더할 것만 미리 보여 주고,
        있는 태그는 빼지 않아요.
      </span>
      <Button size="small" variant="outlined" onClick={() => setOpen(true)}>
        자동 태그 채우기
      </Button>
      {open && (
        <AutoFillDialog groups={groups} onClose={() => setOpen(false)} />
      )}
    </div>
  );
};

export default AutoFillPanel;
