import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import {
  displayTypeLabel,
  placementTypeLabel,
  programCategoryTargetTypeLabel,
  useUpdateProgramCategory,
  useUpdateProgramCategoryDirectTarget,
  useUpdateProgramCategoryPlacements,
  type ProgramCategory,
  type ProgramCategoryDisplayType,
  type ProgramCategoryGroup,
  type ProgramCategoryMatchMode,
  type ProgramCategoryPlacementType,
  type ProgramCategoryTargetType,
} from './programCategoryApi';

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const slugError = (slug: string) =>
  slug !== '' && !SLUG_PATTERN.test(slug)
    ? '영문 소문자·숫자·하이픈만 (예: resume, large-corp)'
    : undefined;

const panelClass =
  'mb-2 ml-3 mt-1 flex flex-col gap-3 rounded-xs bg-neutral-95 p-3';
const rowClass = 'flex flex-wrap items-center gap-2';
const labelClass = 'w-28 shrink-0 text-xsmall14 font-semibold';

interface PlacementDraft {
  placementType: ProgramCategoryPlacementType;
  slug: string;
  mergeChallenges: boolean;
  matchMode: ProgramCategoryMatchMode;
}

/**
 * 노출 위치 설정. 한 노출 목록을 여러 곳에 여러 방식으로 붙인다.
 * 위치마다 키(랜딩 주소), 챌린지 기수·버전 합치기, 필터 칩 조건을 고른다
 */
export const GroupSettingsPanel = ({
  group,
  onDone,
}: {
  group: ProgramCategoryGroup;
  onDone: () => void;
}) => {
  const { snackbar } = useAdminSnackbar();
  const update = useUpdateProgramCategoryPlacements();
  const [drafts, setDrafts] = useState<PlacementDraft[]>(
    (group.placements ?? []).map((p) => ({
      placementType: p.placementType,
      slug: p.slug ?? '',
      mergeChallenges: p.mergeChallenges ?? true,
      matchMode: p.matchMode === 'ALL' ? 'ALL' : 'ANY',
    })),
  );
  const patch = (index: number, next: Partial<PlacementDraft>) =>
    setDrafts((prev) =>
      prev.map((d, i) => (i === index ? { ...d, ...next } : d)),
    );
  const invalid = drafts.some(
    (d) =>
      d.placementType === 'LANDING' && (d.slug === '' || slugError(d.slug)),
  );

  const save = async () => {
    try {
      await update.mutateAsync({
        id: group.id,
        placementList: drafts.map((d) => ({
          placementType: d.placementType,
          slug: d.placementType === 'LANDING' ? d.slug : undefined,
          mergeChallenges: d.mergeChallenges,
          matchMode:
            d.placementType === 'PROGRAM_FILTER' ? d.matchMode : undefined,
        })),
      });
      snackbar('저장했습니다.');
      onDone();
    } catch {
      snackbar('저장에 실패했습니다. 다른 랜딩이 쓰는 키인지 확인하세요.');
    }
  };

  return (
    <div className={panelClass}>
      <p className="text-xsmall14 text-neutral-30">
        이 노출 목록이 어디에 어떻게 보일지 정합니다. 위치를 여러 개 붙일 수
        있고, 하나도 없으면 어디에도 보이지 않습니다.
      </p>
      {drafts.map((d, index) => (
        <div
          key={index}
          className="flex flex-wrap items-center gap-2 rounded-xs bg-white p-2"
        >
          <Select
            size="small"
            value={d.placementType}
            onChange={(e) =>
              patch(index, {
                placementType: e.target.value as ProgramCategoryPlacementType,
              })
            }
            sx={{ minWidth: 200 }}
          >
            {(
              Object.keys(placementTypeLabel) as ProgramCategoryPlacementType[]
            ).map((type) => (
              <MenuItem key={type} value={type}>
                {placementTypeLabel[type]}
              </MenuItem>
            ))}
          </Select>
          {d.placementType === 'LANDING' ? (
            <TextField
              size="small"
              label="주소 키 (/category/키)"
              value={d.slug}
              onChange={(e) => patch(index, { slug: e.target.value.trim() })}
              error={d.slug === '' || Boolean(slugError(d.slug))}
              helperText={
                d.slug === '' ? '랜딩은 키가 필요합니다' : slugError(d.slug)
              }
              sx={{ minWidth: 200 }}
            />
          ) : (
            <Select
              size="small"
              value={d.matchMode}
              onChange={(e) =>
                patch(index, {
                  matchMode: e.target.value as ProgramCategoryMatchMode,
                })
              }
            >
              <MenuItem value="ANY">칩 여러 개 → 하나라도 맞으면</MenuItem>
              <MenuItem value="ALL">칩 여러 개 → 모두 맞아야</MenuItem>
            </Select>
          )}
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={d.mergeChallenges}
                onChange={(e) =>
                  patch(index, { mergeChallenges: e.target.checked })
                }
              />
            }
            label={
              <span className="text-xsmall14">챌린지 기수·버전 합쳐 한 장</span>
            }
          />
          <IconButton
            size="small"
            aria-label="노출 위치 삭제"
            onClick={() =>
              setDrafts((prev) => prev.filter((_, i) => i !== index))
            }
          >
            ×
          </IconButton>
        </div>
      ))}
      <div className={rowClass}>
        <Button
          size="small"
          variant="outlined"
          onClick={() =>
            setDrafts((prev) => [
              ...prev,
              {
                placementType: 'LANDING',
                slug: '',
                mergeChallenges: true,
                matchMode: 'ANY',
              },
            ])
          }
        >
          노출 위치 추가
        </Button>
        <Button
          variant="contained"
          size="small"
          disabled={invalid || update.isPending}
          onClick={save}
        >
          저장
        </Button>
      </div>
    </div>
  );
};

/**
 * 카테고리 설정.
 * 랜딩에서는 섹션 하나라 표시 방식·설명·함께 보일 카테고리를 고른다.
 * 필터·메뉴에서는 키와 바로 갈 상품(누르면 랜딩 대신 상세로)을 쓴다
 */
export const CategorySettingsPanel = ({
  category,
  groups,
  onDone,
}: {
  category: ProgramCategory;
  groups: ProgramCategoryGroup[];
  onDone: () => void;
}) => {
  const { snackbar } = useAdminSnackbar();
  const update = useUpdateProgramCategory();
  const updateDirect = useUpdateProgramCategoryDirectTarget();
  const [slug, setSlug] = useState(category.slug ?? '');
  const [displayType, setDisplayType] = useState<ProgramCategoryDisplayType>(
    category.displayType ?? 'AUTO',
  );
  const [description, setDescription] = useState(category.description ?? '');
  const [sources, setSources] = useState<number[]>(
    category.sourceCategoryIds ?? [],
  );
  const [targetType, setTargetType] = useState<ProgramCategoryTargetType | ''>(
    category.directTargetType ?? '',
  );
  const [targetId, setTargetId] = useState(
    category.directTargetId ? String(category.directTargetId) : '',
  );
  const error = slugError(slug);
  const directIncomplete = (targetType === '') !== (targetId === '');
  const titleOf = new Map(
    groups.flatMap((g) =>
      g.categoryList.map((c) => [c.id, `${g.title} › ${c.title}`] as const),
    ),
  );

  const save = async () => {
    try {
      await update.mutateAsync({
        id: category.id,
        slug,
        displayType,
        description,
        sourceCategoryIdList: sources,
      });
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
      <p className="text-xsmall14 font-semibold text-neutral-10">
        랜딩 섹션으로 보일 때
      </p>
      <div className={rowClass}>
        <span className={labelClass}>표시 방식</span>
        <Select
          size="small"
          value={displayType}
          onChange={(e) =>
            setDisplayType(e.target.value as ProgramCategoryDisplayType)
          }
          sx={{ minWidth: 200 }}
        >
          {(Object.keys(displayTypeLabel) as ProgramCategoryDisplayType[]).map(
            (type) => (
              <MenuItem key={type} value={type}>
                {displayTypeLabel[type]}
              </MenuItem>
            ),
          )}
        </Select>
      </div>
      <div className={rowClass}>
        <span className={labelClass}>섹션 설명</span>
        <TextField
          size="small"
          placeholder="제목 아래 한 줄 (비우면 안 보임)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          inputProps={{ maxLength: 100 }}
          sx={{ flex: 1, minWidth: 280 }}
        />
      </div>
      <div className={rowClass}>
        <span className={labelClass}>함께 보일 카테고리</span>
        <Select
          size="small"
          multiple
          displayEmpty
          value={sources}
          onChange={(e) => setSources(e.target.value as number[])}
          renderValue={(ids) =>
            ids.length === 0
              ? '없음'
              : ids.map((id) => titleOf.get(id) ?? `#${id}`).join(', ')
          }
          sx={{ flex: 1, minWidth: 280 }}
        >
          {groups.flatMap((g) => [
            <ListSubheader key={`g-${g.id}`}>{g.title}</ListSubheader>,
            ...g.categoryList
              .filter((c) => c.id !== category.id)
              .map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  <Checkbox size="small" checked={sources.includes(c.id)} />
                  {c.title}
                </MenuItem>
              )),
          ])}
        </Select>
      </div>
      <p className="text-xxsmall12 text-neutral-40">
        함께 보일 카테고리를 고르면 그 카테고리에 연결된 상품도 이 섹션에
        모입니다. 예: 이력서 랜딩의 챌린지 섹션에 &ldquo;서류 › 이력서&rdquo;를
        고르면 이력서 카테고리 상품을 다시 연결하지 않아도 됩니다.
      </p>

      <p className="mt-2 text-xsmall14 font-semibold text-neutral-10">
        필터·메뉴 항목으로 쓸 때
      </p>
      <div className={rowClass}>
        <span className={labelClass}>키</span>
        <TextField
          size="small"
          value={slug}
          onChange={(e) => setSlug(e.target.value.trim())}
          error={Boolean(error)}
          helperText={error ?? '메뉴가 이 키의 랜딩으로 연결됩니다'}
          sx={{ minWidth: 200 }}
        />
      </div>
      <div className={rowClass}>
        <span className={labelClass}>바로 갈 상품</span>
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
        {directIncomplete && (
          <span className="text-xs text-red-500">
            유형과 id 를 둘 다 넣거나 둘 다 비우세요.
          </span>
        )}
      </div>
      <div>
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
      </div>
    </div>
  );
};
