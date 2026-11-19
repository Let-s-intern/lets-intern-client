import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { CATEGORY_SAVE_FAILED } from '../constants/wording';
import {
  displayTypeLabel,
  useUpdateProgramCategory,
  type ProgramCategory,
  type ProgramCategoryGroup,
} from '../programCategoryApi';
import {
  cardStyleOf,
  displayTypeToSend,
  isLegacyFixedStyle,
  type CardStyle,
} from '../constants/cardStyle';
import DisplayTypePicker from './DisplayTypePicker';
import SectionProducts from './SectionProducts';

const fieldLabel = 'text-xsmall14 font-semibold text-neutral-10';

/**
 * 랜딩 섹션 하나를 한 곳에서 고친다. 제목·설명·카드 모양·상품(직접 고르기, 필터 버튼에서 가져오기)
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
  // 저장 값은 둘 중 하나로 보인다. 고른 것이 처음과 다를 때만 보낸다 (카드 목록 = AUTO)
  const initialStyle = cardStyleOf(category.displayType);
  const [cardStyle, setCardStyle] = useState<CardStyle>(initialStyle);
  const [description, setDescription] = useState(category.description ?? '');
  const [sources, setSources] = useState<number[]>(
    category.sourceCategoryIds ?? [],
  );
  const trimmedTitle = title.trim();

  const save = async () => {
    try {
      await update.mutateAsync({
        id: category.id,
        title: trimmedTitle !== category.title ? trimmedTitle : undefined,
        displayType: displayTypeToSend(category.displayType, cardStyle),
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
        <DisplayTypePicker value={cardStyle} onChange={setCardStyle} />
        {isLegacyFixedStyle(category.displayType) &&
          cardStyle === initialStyle &&
          category.displayType && (
            <p className="text-xxsmall12 text-neutral-40">
              예전에 &quot;{displayTypeLabel[category.displayType]}&quot;(으)로
              저장된 섹션입니다. 바꾸지 않으면 그대로 둡니다.
            </p>
          )}
      </div>

      <SectionProducts
        category={category}
        groups={groups}
        sources={sources}
        onSourcesChange={setSources}
      />

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
