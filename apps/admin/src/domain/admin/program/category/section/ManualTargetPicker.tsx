import { IconButton } from '@mui/material';
import { useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import {
  isSearchableTargetType,
  useProductSearch,
} from '../hooks/useProductSearch';
import {
  programCategoryTargetTypeLabel,
  type ProgramCategoryTargetType,
  type SectionTargetRef,
} from '../programCategoryApi';
import DirectTargetPicker from '../ui/DirectTargetPicker';
import { moveItem } from './sectionDraft';

/** 고른 상품 이름. 저장된 값은 id 뿐이라 검색 API 로 id 를 다시 찾는다. 검색이 없는 유형은 id 만 */
const TargetTitle = ({ target }: { target: SectionTargetRef }) => {
  const { data } = useProductSearch(
    isSearchableTargetType(target.targetType) ? target.targetType : '',
    String(target.targetId),
  );
  const title = data?.find((p) => p.id === target.targetId)?.title;
  return (
    <span className="min-w-0 flex-1 truncate text-neutral-10">
      {title ?? `#${target.targetId}`}
    </span>
  );
};

const sameTarget = (a: SectionTargetRef, b: SectionTargetRef) =>
  a.targetType === b.targetType && a.targetId === b.targetId;

/**
 * 섹션에 직접 고른 상품. 제목으로 찾아 넣고(검색이 없는 유형은 id), 순서를 바꾸고 뺀다.
 * 이 목록은 섹션에만 쓰이고 상품의 태그(필터)에는 영향이 없다
 */
const ManualTargetPicker = ({
  value,
  onChange,
}: {
  value: SectionTargetRef[];
  onChange: (next: SectionTargetRef[]) => void;
}) => {
  // 고르는 칸. 상품을 고르면 바로 목록에 넣고 칸을 비운다
  const [draft, setDraft] = useState<{
    targetType: ProgramCategoryTargetType | '';
    targetId: string;
  }>({ targetType: 'CHALLENGE', targetId: '' });
  const searchable =
    draft.targetType !== '' && isSearchableTargetType(draft.targetType);

  const add = (targetType: ProgramCategoryTargetType, targetId: number) => {
    const next = { targetType, targetId };
    if (!value.some((t) => sameTarget(t, next))) onChange([...value, next]);
    setDraft({ targetType, targetId: '' });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-start gap-2">
        <DirectTargetPicker
          targetType={draft.targetType}
          targetId={draft.targetId}
          onChange={(next) => {
            // 검색 유형은 고르는 순간 넣는다. id 를 직접 넣는 유형은 "넣기" 버튼으로
            if (
              searchable &&
              next.targetType === draft.targetType &&
              next.targetId
            )
              add(
                next.targetType as ProgramCategoryTargetType,
                Number(next.targetId),
              );
            else setDraft(next);
          }}
        />
        {!searchable && draft.targetType !== '' && (
          <button
            type="button"
            disabled={!draft.targetId}
            onClick={() =>
              add(
                draft.targetType as ProgramCategoryTargetType,
                Number(draft.targetId),
              )
            }
            className="mt-1 rounded-xs border border-neutral-80 px-3 py-1 text-xsmall14 disabled:text-neutral-60"
          >
            넣기
          </button>
        )}
      </div>
      {value.length === 0 ? (
        <p className="text-xxsmall12 text-neutral-40">
          직접 고른 상품이 없어요.
        </p>
      ) : (
        <ol className="flex flex-col rounded-xs bg-white">
          {value.map((target, index) => (
            <li
              key={`${target.targetType}-${target.targetId}`}
              className="flex items-center gap-2 px-2 py-1 text-xsmall14"
            >
              <span className="w-4 shrink-0 text-xxsmall12 text-neutral-40">
                {index + 1}
              </span>
              <span className="shrink-0 rounded-xs bg-neutral-95 px-1.5 text-xxsmall12 text-neutral-40">
                {programCategoryTargetTypeLabel[target.targetType]}
              </span>
              <TargetTitle target={target} />
              <IconButton
                size="small"
                aria-label="위로"
                disabled={index === 0}
                onClick={() => onChange(moveItem(value, index, -1))}
              >
                <FaArrowUp size={10} />
              </IconButton>
              <IconButton
                size="small"
                aria-label="아래로"
                disabled={index === value.length - 1}
                onClick={() => onChange(moveItem(value, index, 1))}
              >
                <FaArrowDown size={10} />
              </IconButton>
              <IconButton
                size="small"
                aria-label="빼기"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
              >
                ×
              </IconButton>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default ManualTargetPicker;
