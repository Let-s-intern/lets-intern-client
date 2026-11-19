import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button, FormControlLabel, Switch } from '@mui/material';
import { useState } from 'react';
import {
  CATEGORY_SAVE_FAILED,
  DIRECT_TARGET_HELP,
  DIRECT_TARGET_LABEL,
} from '../constants/wording';
import {
  useUpdateProgramCategory,
  useUpdateProgramCategoryDirectTarget,
  type ProgramCategory,
  type ProgramCategoryTargetType,
} from '../programCategoryApi';
import { slugError } from '../utils/placementUtils';
import DirectTargetPicker from './DirectTargetPicker';
import PageAddressField from './PageAddressField';

/** 필터 버튼·메뉴 항목으로 쓰일 때. 누르면 어디로 갈지 정한다 */
const MenuButtonEditor = ({
  category,
  onDone,
}: {
  category: ProgramCategory;
  onDone: () => void;
}) => {
  const { snackbar } = useAdminSnackbar();
  const update = useUpdateProgramCategory();
  const updateDirect = useUpdateProgramCategoryDirectTarget();
  const [slug, setSlug] = useState(category.slug ?? '');
  const [direct, setDirect] = useState(
    Boolean(category.directTargetType && category.directTargetId),
  );
  const [targetType, setTargetType] = useState<ProgramCategoryTargetType | ''>(
    category.directTargetType ?? '',
  );
  const [targetId, setTargetId] = useState(
    category.directTargetId ? String(category.directTargetId) : '',
  );
  const directIncomplete = direct && (targetType === '' || targetId === '');
  // 오류는 저장을 누른 뒤에 보인다
  const [submitted, setSubmitted] = useState(false);

  const save = async () => {
    setSubmitted(true);
    if (slugError(slug) || directIncomplete) return;
    try {
      await update.mutateAsync({ id: category.id, slug });
      await updateDirect.mutateAsync({
        id: category.id,
        targetType: direct && targetType ? targetType : null,
        targetId: direct && targetId ? Number(targetId) : null,
      });
      snackbar('저장했습니다.');
      onDone();
    } catch {
      snackbar(CATEGORY_SAVE_FAILED);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xs bg-neutral-95 p-4">
      <PageAddressField
        value={slug}
        onChange={setSlug}
        showErrors={submitted}
        helperText={
          slug
            ? `메뉴에서 누르면 /category/${slug} 로 갑니다.`
            : '필터 버튼으로만 쓰면 비워 두세요.'
        }
      />
      <div className="flex flex-col gap-2">
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
          <p className="text-xxsmall12 text-neutral-40">{DIRECT_TARGET_HELP}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="contained"
          size="small"
          disabled={update.isPending || updateDirect.isPending}
          onClick={save}
        >
          저장
        </Button>
        <Button size="small" onClick={onDone}>
          닫기
        </Button>
      </div>
    </div>
  );
};

export default MenuButtonEditor;
