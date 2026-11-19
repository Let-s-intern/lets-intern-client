import { useState } from 'react';
import type { CategoryActions } from '../hooks/useCategoryActions';
import type { ProgramCategoryGroup } from '../programCategoryApi';
import { tagsOf } from '../utils/tagUtils';
import TagListPanel from './TagListPanel';
import TagPageEditor from './TagPageEditor';

/** 프로그램 분류. 왼쪽 분류 목록, 오른쪽 그 분류의 페이지 */
const TagTab = ({
  groups,
  actions,
}: {
  groups: ProgramCategoryGroup[];
  actions: CategoryActions;
}) => {
  const tags = tagsOf(groups);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected =
    tags.find(({ tag }) => tag.id === selectedId)?.tag ?? tags[0]?.tag;

  return (
    <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <TagListPanel
        groups={groups}
        selectedId={selected?.id ?? null}
        onSelect={setSelectedId}
        actions={actions}
      />
      {selected ? (
        <TagPageEditor key={selected.id} tag={selected} groups={groups} />
      ) : (
        <p className="text-xsmall14 text-neutral-40">
          아직 분류가 없어요. 왼쪽에서 추가하세요.
        </p>
      )}
    </div>
  );
};

export default TagTab;
