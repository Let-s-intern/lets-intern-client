import { Autocomplete, Chip, TextField } from '@mui/material';
import { useAllProducts } from '../hooks/useAllProducts';
import { matchByKeywords } from '../utils/autoTag';

/** 태그 자동 키워드. 상품 제목 등에 이 말이 있으면 이 태그를 추천한다. 아래에 잡히는 상품을 미리 보인다 */
const KeywordsField = ({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) => {
  const { data, isLoading } = useAllProducts();
  const matched = data ? matchByKeywords(data, value) : [];
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xsmall14 font-semibold text-neutral-10">
        자동 키워드
      </span>
      <Autocomplete
        multiple
        freeSolo
        size="small"
        options={[]}
        value={value}
        onChange={(_, next) =>
          onChange([
            ...new Set(next.map((v) => String(v).trim()).filter(Boolean)),
          ])
        }
        renderTags={(tags, getTagProps) =>
          tags.map((t, index) => (
            <Chip {...getTagProps({ index })} key={t} size="small" label={t} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} placeholder="말을 넣고 Enter (예: 자소서)" />
        )}
      />
      <p className="text-xxsmall12 text-neutral-40">
        {value.length === 0
          ? '키워드가 없으면 자동 추천에 쓰지 않아요.'
          : isLoading
            ? '잡히는 상품을 세는 중…'
            : `이 키워드로 잡히는 상품 ${matched.length}개${
                matched.length > 0
                  ? ` · ${matched
                      .slice(0, 5)
                      .map((p) => p.title)
                      .join(', ')}${matched.length > 5 ? ' …' : ''}`
                  : ''
              }`}
      </p>
    </div>
  );
};

export default KeywordsField;
