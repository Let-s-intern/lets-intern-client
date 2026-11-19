import { useState } from 'react';
import { usePublicCategoryTargets } from '../hooks/usePublicCategoryTargets';
import {
  programCategoryTargetTypeLabel,
  type ProgramCategoryGroup,
  type ProgramCategoryTargetType,
} from '../programCategoryApi';
import { productExposuresOf } from '../utils/placementUtils';

/**
 * 상품마다 어디에 보이는지. 노출 위치가 붙은 목록의 보이는 카테고리를 한 번에 조회한다.
 * 펼칠 때만 부른다
 */
const ExposureTable = ({ groups }: { groups: ProgramCategoryGroup[] }) => {
  const placed = groups.filter(
    (g) => g.isVisible && (g.placements ?? []).length > 0,
  );
  const categoryIds = placed.flatMap((g) =>
    g.categoryList.filter((c) => c.isVisible).map((c) => c.id),
  );
  const { data: targets = [], isLoading } = usePublicCategoryTargets(
    categoryIds,
    false,
  );
  const [keyword, setKeyword] = useState('');
  if (isLoading)
    return <p className="text-xsmall14 text-neutral-40">불러오는 중…</p>;
  const exposures = productExposuresOf(placed, targets).filter((e) =>
    e.title.toLowerCase().includes(keyword.trim().toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-2">
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="상품 제목으로 찾기"
        className="w-72 rounded-xs border border-neutral-80 px-2 py-1 text-xsmall14"
      />
      <ul className="flex flex-col gap-1 text-xsmall14">
        {exposures.map((e) => (
          <li key={e.key}>
            <span className="text-neutral-40">
              [
              {programCategoryTargetTypeLabel[
                e.targetType as ProgramCategoryTargetType
              ] ?? e.targetType}
              ]{' '}
            </span>
            <span className="font-semibold text-neutral-10">{e.title}</span>
            <span className="text-neutral-40"> → {e.places.join(' / ')}</span>
          </li>
        ))}
        {exposures.length === 0 && (
          <li className="text-neutral-40">해당하는 상품이 없습니다.</li>
        )}
      </ul>
    </div>
  );
};

const ProductExposureList = ({
  groups,
}: {
  groups: ProgramCategoryGroup[];
}) => {
  const [open, setOpen] = useState(false);
  return (
    <details
      className="rounded-sm border border-neutral-80 bg-white"
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="cursor-pointer px-3 py-2 font-semibold">
        상품별 노출 위치
        <span className="ml-2 text-xsmall14 font-normal text-neutral-40">
          상품 하나가 어느 페이지·섹션·필터 버튼에 나오는지
        </span>
      </summary>
      <div className="border-t border-neutral-80 p-3">
        {open && <ExposureTable groups={groups} />}
      </div>
    </details>
  );
};

export default ProductExposureList;
