import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import {
  programCategoryTargetTypeLabel,
  useUpdateProgramCategory,
  useUpdateProgramCategoryDirectTarget,
  useUpdateProgramCategoryGroup,
  type ProgramCategory,
  type ProgramCategoryGroup,
  type ProgramCategoryGroupPurpose,
  type ProgramCategoryTargetType,
} from './programCategoryApi';

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const slugError = (slug: string) =>
  slug !== '' && !SLUG_PATTERN.test(slug)
    ? '영문 소문자·숫자·하이픈만 (예: resume, large-corp)'
    : undefined;

const panelClass =
  'mb-2 ml-3 mt-1 flex flex-wrap items-center gap-2 rounded-xs bg-neutral-95 p-3';

/** 노출 목록 설정: 용도(필터용·랜딩용)와 프론트가 부르는 고정 키 */
export const GroupSettingsPanel = ({
  group,
  onDone,
}: {
  group: ProgramCategoryGroup;
  onDone: () => void;
}) => {
  const { snackbar } = useAdminSnackbar();
  const update = useUpdateProgramCategoryGroup();
  const [purpose, setPurpose] = useState<ProgramCategoryGroupPurpose>(
    group.purpose ?? 'FILTER',
  );
  const [slug, setSlug] = useState(group.slug ?? '');
  const error = slugError(slug);

  const save = async () => {
    try {
      await update.mutateAsync({ id: group.id, purpose, slug });
      snackbar('저장했습니다.');
      onDone();
    } catch {
      snackbar('저장에 실패했습니다. 다른 목록이 쓰는 키인지 확인하세요.');
    }
  };

  return (
    <div className={panelClass}>
      <span className="text-xsmall14 font-semibold">용도</span>
      <Select
        size="small"
        value={purpose}
        onChange={(e) =>
          setPurpose(e.target.value as ProgramCategoryGroupPurpose)
        }
      >
        <MenuItem value="FILTER">필터용 (메뉴·목록 필터)</MenuItem>
        <MenuItem value="LANDING">랜딩용 (카테고리 하나 = 섹션 하나)</MenuItem>
      </Select>
      <TextField
        size="small"
        label="키 (프론트가 부르는 이름)"
        value={slug}
        onChange={(e) => setSlug(e.target.value.trim())}
        error={Boolean(error)}
        helperText={error}
        sx={{ minWidth: 240 }}
      />
      <Button
        variant="contained"
        size="small"
        disabled={Boolean(error) || update.isPending}
        onClick={save}
      >
        저장
      </Button>
    </div>
  );
};

/** 카테고리 설정: 고정 키와 바로 갈 상품. 바로 갈 상품을 두면 랜딩 대신 그 상세로 간다 */
export const CategorySettingsPanel = ({
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
  const [targetType, setTargetType] = useState<ProgramCategoryTargetType | ''>(
    category.directTargetType ?? '',
  );
  const [targetId, setTargetId] = useState(
    category.directTargetId ? String(category.directTargetId) : '',
  );
  const error = slugError(slug);
  const directIncomplete = (targetType === '') !== (targetId === '');

  const save = async () => {
    try {
      await update.mutateAsync({ id: category.id, slug });
      await updateDirect.mutateAsync({
        id: category.id,
        targetType: targetType || null,
        targetId: targetId ? Number(targetId) : null,
      });
      snackbar('저장했습니다.');
      onDone();
    } catch {
      snackbar(
        '저장에 실패했습니다. 키가 겹치거나 상품 id 가 없는지 확인하세요.',
      );
    }
  };

  return (
    <div className={panelClass}>
      <TextField
        size="small"
        label="키"
        value={slug}
        onChange={(e) => setSlug(e.target.value.trim())}
        error={Boolean(error)}
        helperText={error}
        sx={{ minWidth: 180 }}
      />
      <span className="text-xsmall14 font-semibold">바로 갈 상품</span>
      <Select
        size="small"
        displayEmpty
        value={targetType}
        onChange={(e) =>
          setTargetType(e.target.value as ProgramCategoryTargetType | '')
        }
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="">없음 (랜딩으로)</MenuItem>
        {(
          Object.keys(
            programCategoryTargetTypeLabel,
          ) as ProgramCategoryTargetType[]
        ).map((type) => (
          <MenuItem key={type} value={type}>
            {programCategoryTargetTypeLabel[type]}
          </MenuItem>
        ))}
      </Select>
      <TextField
        size="small"
        label="상품 id"
        value={targetId}
        onChange={(e) => setTargetId(e.target.value.replace(/\D/g, ''))}
        sx={{ width: 120 }}
      />
      <Button
        variant="contained"
        size="small"
        disabled={
          Boolean(error) ||
          directIncomplete ||
          update.isPending ||
          updateDirect.isPending
        }
        onClick={save}
      >
        저장
      </Button>
      {directIncomplete && (
        <span className="text-xs text-red-500">
          유형과 id 를 둘 다 넣거나 둘 다 비우세요.
        </span>
      )}
    </div>
  );
};
