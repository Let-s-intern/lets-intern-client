import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import {
  Button,
  Checkbox,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import {
  CATEGORY_SAVE_FAILED,
  SOURCES_HELP,
  SOURCES_LABEL,
} from '../constants/wording';
import ProgramCategoryTargetList from '../ProgramCategoryTargetList';
import {
  useUpdateProgramCategory,
  type ProgramCategory,
  type ProgramCategoryDisplayType,
  type ProgramCategoryGroup,
} from '../programCategoryApi';
import AdvancedArea from './AdvancedArea';
import DisplayTypePicker from './DisplayTypePicker';

const fieldLabel = 'text-xsmall14 font-semibold text-neutral-10';

/**
 * 랜딩 섹션 하나를 한 곳에서 고친다. 제목·설명·카드 모양·연결된 상품.
 * 다른 섹션 상품 함께 보여주기는 고급 설정에 접어 둔다
 */
const SectionEditor = ({
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
  const [title, setTitle] = useState(category.title);
  const [displayType, setDisplayType] = useState<ProgramCategoryDisplayType>(
    category.displayType ?? 'AUTO',
  );
  const [description, setDescription] = useState(category.description ?? '');
  const [sources, setSources] = useState<number[]>(
    category.sourceCategoryIds ?? [],
  );
  const titleOf = new Map(
    groups.flatMap((g) =>
      g.categoryList.map((c) => [c.id, `${g.title} › ${c.title}`] as const),
    ),
  );
  const trimmedTitle = title.trim();

  const save = async () => {
    try {
      await update.mutateAsync({
        id: category.id,
        title: trimmedTitle !== category.title ? trimmedTitle : undefined,
        displayType,
        description,
        sourceCategoryIdList: sources,
      });
      snackbar('저장했습니다.');
      onDone();
    } catch {
      snackbar(CATEGORY_SAVE_FAILED);
    }
  };

  return (
    <div className="mb-3 ml-3 mt-1 flex flex-col gap-4 rounded-xs bg-neutral-95 p-4">
      <div className="flex flex-wrap gap-2">
        <TextField
          size="small"
          label="섹션 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          inputProps={{ maxLength: 30 }}
          error={trimmedTitle === ''}
          sx={{ minWidth: 240 }}
        />
        <TextField
          size="small"
          label="섹션 설명"
          placeholder="제목 아래 한 줄 (비우면 안 보임)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          inputProps={{ maxLength: 100 }}
          sx={{ flex: 1, minWidth: 280 }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className={fieldLabel}>카드 모양</span>
        <DisplayTypePicker value={displayType} onChange={setDisplayType} />
      </div>

      <div className="flex flex-col gap-1">
        <span className={fieldLabel}>이 섹션의 상품</span>
        <p className="text-xxsmall12 text-neutral-40">
          상품은 각 상품 수정 화면의 &quot;노출 분류&quot;에서 넣습니다.
        </p>
        <div className="rounded-xs bg-white py-1">
          <ProgramCategoryTargetList categoryId={category.id} />
        </div>
      </div>

      <AdvancedArea>
        <span className={fieldLabel}>{SOURCES_LABEL}</span>
        <p className="text-xxsmall12 text-neutral-40">{SOURCES_HELP}</p>
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
          sx={{ minWidth: 280 }}
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
      </AdvancedArea>

      <div className="flex gap-2">
        <Button
          variant="contained"
          size="small"
          disabled={trimmedTitle === '' || update.isPending}
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

export default SectionEditor;
