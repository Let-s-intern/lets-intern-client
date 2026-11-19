import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { useState } from 'react';
import { useAdminProgramCategoryGroupsQuery } from './programCategoryApi';
import { suggestTags, tagsToAdd, type AutoTagInput } from './utils/autoTag';
import { autoTagRulesOf, filterRowsOf, tagsOf } from './utils/tagUtils';

interface ProgramCategoryPickerProps {
  /** 아직 모르면 undefined. 그동안은 체크를 막는다 */
  selectedIds: number[] | undefined;
  onToggle: (id: number) => void;
  /** 펼쳤을 때 체크박스 위에 붙는 안내 */
  note: string;
  /** 추천 태그를 낼 상품 정보 (제목·챌린지 구분·블로그 태그 등) */
  autoTagInput?: AutoTagInput;
}

/**
 * 상품의 프로그램 분류. 분류(이력서·포트폴리오·HR …)만 여러 개 고른다. 위치는 고르지 않는다.
 * 고른 분류의 페이지에서 조건에 맞는 섹션에 자동으로 들어가고, /program 필터의 그 버튼에도 나온다.
 * 저장되는 값은 예전과 같은 카테고리 id 목록이다
 */
const ProgramCategoryPicker = ({
  selectedIds,
  onToggle,
  note,
  autoTagInput,
}: ProgramCategoryPickerProps) => {
  const { data: groups = [] } = useAdminProgramCategoryGroupsQuery();
  const [expanded, setExpanded] = useState(false);
  // 추천은 버튼을 눌렀을 때만 계산해 보여 준다. 저절로 뜨거나 체크되지 않는다
  const [showSuggestions, setShowSuggestions] = useState(false);
  const tags = tagsOf(groups);
  const selected = tags.filter(({ tag }) => selectedIds?.includes(tag.id));
  // 추천 중 아직 안 고른 것. 누르면 더한다. 고른 태그를 빼는 일은 없다
  const recommended =
    showSuggestions && autoTagInput && selectedIds
      ? tagsToAdd(
          suggestTags(autoTagInput, autoTagRulesOf(groups)),
          selectedIds,
        )
      : [];
  // 분류가 아닌 예전 랜딩 섹션 연결. 고르지 않고 그대로 둔다
  const legacyCount = (selectedIds ?? []).filter(
    (id) => !tags.some(({ tag }) => tag.id === id),
  ).length;
  // 숨긴 줄은 맨 뒤로
  const rows = [...filterRowsOf(groups)].sort(
    (a, b) => Number(!a.isVisible) - Number(!b.isVisible),
  );

  return (
    <div className="rounded-xs border border-neutral-80 px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xsmall14 font-semibold text-neutral-0">
          프로그램 분류
        </span>
        {selected.length === 0 ? (
          <span className="text-xsmall14 text-neutral-40">지정 안 됨</span>
        ) : (
          selected.map(({ tag }) => (
            <span
              key={tag.id}
              className="rounded-xs bg-neutral-95 px-2 py-0.5 text-xsmall14 text-neutral-10"
            >
              {tag.title}
            </span>
          ))
        )}
        {autoTagInput && (
          <Button
            size="small"
            sx={{ ml: 'auto' }}
            className="program_category_auto_suggest"
            onClick={() => setShowSuggestions((prev) => !prev)}
          >
            {showSuggestions ? '추천 닫기' : '태그 자동 추천'}
          </Button>
        )}
        <Button
          size="small"
          sx={autoTagInput ? undefined : { ml: 'auto' }}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? '접기' : '수정'}
        </Button>
      </div>

      {showSuggestions && recommended.length === 0 && (
        <p className="mt-1.5 text-xxsmall12 text-neutral-40">
          더 붙일 추천 태그가 없어요.
        </p>
      )}

      {recommended.length > 0 && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="text-xxsmall12 text-neutral-40">추천 태그</span>
          {recommended.length > 1 && (
            <button
              type="button"
              onClick={() => recommended.forEach((s) => onToggle(s.tagId))}
              className="rounded-full bg-primary px-2 py-0.5 text-xxsmall12 text-white"
            >
              모두 추가
            </button>
          )}
          {recommended.map((s) => (
            <button
              key={s.tagId}
              type="button"
              onClick={() => onToggle(s.tagId)}
              title={s.reasons.join(' · ')}
              className="rounded-full border border-dashed border-primary/60 px-2 py-0.5 text-xxsmall12 text-primary hover:bg-primary/5"
            >
              + {s.tagTitle}
              <span className="ml-1 text-neutral-40">{s.reasons[0]}</span>
            </button>
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <ul className="mt-1 flex flex-col text-xxsmall12 text-neutral-40">
          {selected.map(({ tag, row }) => (
            <li key={tag.id}>
              {tag.title} →{' '}
              {tag.slug
                ? `/category/${tag.slug} 페이지에서 조건이 맞는 섹션에 보여요 · `
                : ''}
              /program 필터 &quot;{row.title} &gt; {tag.title}&quot; 버튼
            </li>
          ))}
        </ul>
      )}

      {expanded &&
        (rows.length === 0 ? (
          <p className="mt-2 text-xsmall14 text-neutral-40">
            프로그램 분류가 없습니다. 사이드바 프로그램 관리의 &quot;프로그램
            분류&quot;에서 먼저 추가하세요.
          </p>
        ) : (
          <div className="mt-2 flex flex-col gap-2 border-t border-neutral-80 pt-2">
            <p className="text-xsmall14 text-neutral-40">{note}</p>
            {rows.map((row) => (
              <div key={row.id}>
                <p className="text-xxsmall12 font-semibold text-neutral-40">
                  {row.title}
                  {!row.isVisible && ' · 숨김 · 사이트 필터에 안 보임'}
                </p>
                <div className="flex flex-wrap">
                  {row.categoryList.map((tag) => (
                    <FormControlLabel
                      key={tag.id}
                      control={
                        <Checkbox
                          size="small"
                          disabled={!selectedIds}
                          checked={selectedIds?.includes(tag.id) ?? false}
                          onChange={() => onToggle(tag.id)}
                        />
                      }
                      label={tag.title}
                    />
                  ))}
                </div>
              </div>
            ))}
            {legacyCount > 0 && (
              <p className="text-xxsmall12 text-neutral-40">
                예전 랜딩 섹션에 직접 연결된 것이 {legacyCount}개 있어요.
                여기서는 바꾸지 않고 그대로 둬요.
              </p>
            )}
          </div>
        ))}
    </div>
  );
};

export default ProgramCategoryPicker;
