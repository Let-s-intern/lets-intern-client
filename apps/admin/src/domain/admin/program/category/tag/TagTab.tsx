import { useState } from 'react';
import type { CategoryActions } from '../hooks/useCategoryActions';
import type { ProgramCategoryGroup } from '../programCategoryApi';
import { legacyLandingGroupsOf, tagsOf } from '../utils/tagUtils';
import TagListPanel from './TagListPanel';
import TagPageEditor from './TagPageEditor';

/** 프로그램 분류. 왼쪽 분류 목록, 오른쪽 그 분류의 페이지 */
const TagTab = ({
  groups,
  actions,
  onGoCheck,
}: {
  groups: ProgramCategoryGroup[];
  actions: CategoryActions;
  /** 점검 탭으로 (예전 랜딩 옮기기) */
  onGoCheck: () => void;
}) => {
  const legacyCount = legacyLandingGroupsOf(groups).length;
  const tags = tagsOf(groups);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected =
    tags.find(({ tag }) => tag.id === selectedId)?.tag ?? tags[0]?.tag;

  return (
    <div className="mt-4 flex flex-col gap-4">
      {legacyCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xs bg-neutral-95 px-4 py-2.5 text-xsmall14 text-neutral-10">
          예전 랜딩 {legacyCount}개를 아직 옮기지 않았어요. 옮기기 전에는
          미리보기에 예전 랜딩이 보여요.
          <button
            type="button"
            onClick={onGoCheck}
            className="font-semibold text-primary hover:underline"
          >
            점검 탭에서 옮기기 →
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[310px_minmax(0,1fr)]">
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
    </div>
  );
};

export default TagTab;
