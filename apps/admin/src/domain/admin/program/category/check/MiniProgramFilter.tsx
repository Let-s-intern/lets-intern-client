import { usePublicCategoryTargets } from '../hooks/usePublicCategoryTargets';
import type { ProgramCategoryGroup } from '../programCategoryApi';
import type { PreviewHighlight } from '../preview/ui/LandingPreview';
import { filterRowsOf } from '../utils/tagUtils';

/** /program 을 줄여 그린 것: 필터 줄의 버튼, 누른 버튼, 그 버튼의 상품 카드 */
const MiniProgramFilter = ({
  groups,
  tagId,
  highlight,
}: {
  groups: ProgramCategoryGroup[];
  tagId: number;
  highlight?: PreviewHighlight['target'];
}) => {
  const { data: targets = [], isLoading } = usePublicCategoryTargets(
    [tagId],
    true,
  );
  const rows = filterRowsOf(groups).filter((r) => r.isVisible);
  return (
    <div className="flex flex-col gap-4 rounded-sm border border-neutral-90 bg-white p-6">
      <p className="text-xxsmall12 text-neutral-40">letscareer.co.kr/program</p>
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.id} className="flex flex-wrap items-center gap-1.5">
            <span className="w-20 shrink-0 text-xsmall14 font-semibold text-neutral-10">
              {row.title}
            </span>
            {row.categoryList
              .filter((c) => c.isVisible)
              .map((c) => (
                <span
                  key={c.id}
                  data-highlight={c.id === tagId ? 'chip' : undefined}
                  className={`rounded-full border px-3 py-1 text-xsmall14 ${
                    c.id === tagId
                      ? 'border-neutral-0 bg-neutral-0 text-white'
                      : 'border-neutral-80 text-neutral-30'
                  }`}
                >
                  {c.title}
                </span>
              ))}
          </div>
        ))}
      </div>
      {isLoading ? (
        <p className="text-xsmall14 text-neutral-40">불러오는 중…</p>
      ) : targets.length === 0 ? (
        <div className="rounded-xs border border-dashed border-neutral-80 py-8 text-center text-xsmall14 text-neutral-50">
          이 버튼을 누르면 결과가 비어 있어요
        </div>
      ) : (
        <ul className="grid grid-cols-4 gap-4">
          {targets.map((t) => {
            const on =
              highlight?.targetType === t.targetType &&
              highlight.targetId === t.targetId;
            return (
              <li
                key={`${t.targetType}-${t.targetId}`}
                data-highlight={on ? 'target' : undefined}
                className={`relative flex flex-col gap-1.5 ${
                  on
                    ? 'rounded-xs outline outline-2 outline-offset-4 outline-primary'
                    : ''
                }`}
              >
                {on && (
                  <span className="absolute -top-3 left-2 z-10 rounded-full bg-primary px-2 py-0.5 text-xxsmall12 font-semibold text-white">
                    이 상품
                  </span>
                )}
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xs bg-neutral-95">
                  {t.thumbnail && (
                    <img
                      src={t.thumbnail}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <p className="line-clamp-2 text-xsmall14 font-semibold text-neutral-0">
                  {t.title}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MiniProgramFilter;
