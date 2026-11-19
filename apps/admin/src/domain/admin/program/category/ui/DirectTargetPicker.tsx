import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { Autocomplete, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import {
  isSearchableTargetType,
  useProductSearch,
  type FoundProduct,
} from '../hooks/useProductSearch';
import {
  programCategoryTargetTypeLabel,
  type ProgramCategoryTargetType,
} from '../programCategoryApi';

/** 고른 상품의 제목. 저장된 값은 id 뿐이라 id 로 한 번 찾아 온다 */
const useSelectedTitle = (
  targetType: ProgramCategoryTargetType,
  targetId: string,
) => {
  const { data } = useProductSearch(targetType, targetId);
  return data?.find((p) => String(p.id) === targetId)?.title;
};

const ProductSearch = ({
  targetType,
  targetId,
  onChange,
}: {
  targetType: ProgramCategoryTargetType;
  targetId: string;
  onChange: (targetId: string) => void;
}) => {
  const [input, setInput] = useState('');
  const keyword = useDebouncedValue(input, 300);
  const { data: options = [], isFetching } = useProductSearch(
    targetType,
    keyword,
  );
  const selectedTitle = useSelectedTitle(targetType, targetId);
  const value: FoundProduct | null = targetId
    ? {
        id: Number(targetId),
        title: selectedTitle ?? `#${targetId}`,
      }
    : null;

  return (
    <Autocomplete
      size="small"
      value={value}
      options={options}
      loading={isFetching}
      filterOptions={(o) => o}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      getOptionLabel={(o) => `${o.title} (#${o.id})`}
      onChange={(_, next) => onChange(next ? String(next.id) : '')}
      onInputChange={(_, next, reason) => {
        if (reason === 'input') setInput(next);
      }}
      noOptionsText={keyword ? '찾는 상품이 없습니다' : '제목을 입력하세요'}
      renderInput={(params) => (
        <TextField
          {...params}
          label="상품 찾기 (제목 또는 id)"
          placeholder="예: 이력서 완성 챌린지"
        />
      )}
      sx={{ flex: 1, minWidth: 320 }}
    />
  );
};

/**
 * 바로 갈 상품 고르기. 검색할 수 있는 유형은 제목으로 찾고,
 * 검색 API 가 없는 유형(1:1 멘토링·블로그·마그넷)은 id 를 직접 넣는다
 */
const DirectTargetPicker = ({
  targetType,
  targetId,
  onChange,
}: {
  targetType: ProgramCategoryTargetType | '';
  targetId: string;
  onChange: (next: {
    targetType: ProgramCategoryTargetType | '';
    targetId: string;
  }) => void;
}) => (
  <div className="flex flex-wrap items-start gap-2">
    <Select
      size="small"
      displayEmpty
      value={targetType}
      onChange={(e) =>
        onChange({
          targetType: e.target.value as ProgramCategoryTargetType | '',
          targetId: '',
        })
      }
      sx={{ minWidth: 160 }}
    >
      <MenuItem value="" disabled>
        상품 유형
      </MenuItem>
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
    {targetType !== '' && isSearchableTargetType(targetType) ? (
      <ProductSearch
        key={targetType}
        targetType={targetType}
        targetId={targetId}
        onChange={(id) => onChange({ targetType, targetId: id })}
      />
    ) : (
      <TextField
        size="small"
        label="상품 id"
        disabled={targetType === ''}
        value={targetId}
        onChange={(e) =>
          onChange({ targetType, targetId: e.target.value.replace(/\D/g, '') })
        }
        helperText={
          targetType === ''
            ? undefined
            : '이 유형은 검색이 없어 id 를 직접 넣습니다'
        }
        sx={{ width: 220 }}
      />
    )}
  </div>
);

export default DirectTargetPicker;
