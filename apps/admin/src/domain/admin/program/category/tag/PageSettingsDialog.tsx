import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useState } from 'react';
import { DIRECT_TARGET_HELP, DIRECT_TARGET_LABEL } from '../constants/wording';
import {
  useUpdateProgramCategory,
  useUpdateProgramCategoryDirectTarget,
  useUpdateProgramCategoryPage,
  type ProgramCategory,
  type ProgramCategoryGroup,
  type ProgramCategoryTargetType,
} from '../programCategoryApi';
import DirectTargetPicker from '../ui/DirectTargetPicker';
import PageAddressField, { pageAddressError } from '../ui/PageAddressField';
import PageMenuFields, { type LandingMenuDraft } from './PageMenuFields';

const pageOf = (tag: ProgramCategory): LandingMenuDraft => ({
  showInMenu: tag.showInMenu ?? false,
  menuGroup: tag.menuGroup ?? '',
  menuLabel: tag.menuLabel ?? '',
  menuOrder: tag.menuOrder ?? null,
  heroTitle: tag.heroTitle ?? '',
  heroDescription: tag.heroDescription ?? '',
});

/** 분류 페이지 설정: 주소, GNB 메뉴, 상단 문구, 메뉴를 누르면 상품으로 바로 이동 */
const PageSettingsDialog = ({
  tag,
  groups,
  onClose,
}: {
  tag: ProgramCategory;
  groups: ProgramCategoryGroup[];
  onClose: () => void;
}) => {
  const { snackbar } = useAdminSnackbar();
  const updateCategory = useUpdateProgramCategory();
  const updatePage = useUpdateProgramCategoryPage();
  const updateDirect = useUpdateProgramCategoryDirectTarget();
  const [slug, setSlug] = useState(tag.slug ?? '');
  const [page, setPage] = useState<LandingMenuDraft>(() => pageOf(tag));
  const [direct, setDirect] = useState(
    Boolean(tag.directTargetType && tag.directTargetId),
  );
  const [targetType, setTargetType] = useState<ProgramCategoryTargetType | ''>(
    tag.directTargetType ?? '',
  );
  const [targetId, setTargetId] = useState(
    tag.directTargetId ? String(tag.directTargetId) : '',
  );
  const [submitted, setSubmitted] = useState(false);
  const directIncomplete = direct && (targetType === '' || targetId === '');
  const busy =
    updateCategory.isPending || updatePage.isPending || updateDirect.isPending;

  const save = async () => {
    setSubmitted(true);
    if (pageAddressError(slug, false) || directIncomplete) return;
    try {
      if (slug !== (tag.slug ?? ''))
        await updateCategory.mutateAsync({ id: tag.id, slug });
      await updatePage.mutateAsync({
        id: tag.id,
        ...page,
        menuOrder: page.menuOrder ?? undefined,
      });
      const wasDirect = Boolean(tag.directTargetType && tag.directTargetId);
      if (direct || wasDirect)
        await updateDirect.mutateAsync({
          id: tag.id,
          targetType: direct && targetType ? targetType : null,
          targetId: direct && targetId ? Number(targetId) : null,
        });
      snackbar('저장했습니다.');
      onClose();
    } catch {
      snackbar('저장에 실패했습니다. 다른 분류가 쓰는 주소인지 확인하세요.');
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{tag.title} 페이지 설정</DialogTitle>
      <DialogContent className="flex flex-col gap-4 !pt-2">
        <PageAddressField
          value={slug}
          onChange={setSlug}
          showErrors={submitted}
          helperText="사이트에서 이 주소로 열려요. 바꾸면 예전 주소는 열리지 않아요."
        />
        <div className="border-t border-neutral-90 pt-3">
          <PageMenuFields
            value={page}
            onChange={setPage}
            groups={groups}
            defaultLabel={tag.title}
          />
        </div>
        <div className="flex flex-col gap-2 border-t border-neutral-90 pt-3">
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={direct}
                onChange={(e) => setDirect(e.target.checked)}
              />
            }
            label={<span className="text-xsmall14">{DIRECT_TARGET_LABEL}</span>}
          />
          {direct ? (
            <>
              <DirectTargetPicker
                targetType={targetType}
                targetId={targetId}
                onChange={(next) => {
                  setTargetType(next.targetType);
                  setTargetId(next.targetId);
                }}
              />
              {submitted && directIncomplete && (
                <span className="text-xs text-red-500">
                  상품을 고르거나 바로 이동을 끄세요.
                </span>
              )}
            </>
          ) : (
            <p className="text-xxsmall12 text-neutral-40">
              {DIRECT_TARGET_HELP}
            </p>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" disabled={busy} onClick={save}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PageSettingsDialog;
