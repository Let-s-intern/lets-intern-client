import type { LiveMentoringCategory } from '@/api/live-mentoring/liveMentoringSchema';
import { CATEGORY_LABELS, CATEGORY_FILTER_ORDER } from '../constants';

interface LiveMentoringFilterSideBarProps {
  selected: LiveMentoringCategory[];
  onToggle: (category: LiveMentoringCategory) => void;
}

/**
 * 1대1 라이브 멘토링 전용 필터 사이드바.
 *
 * 프로그램 쪽 `FilterSideBar` 는 관심 직무·커리어 단계·프로그램 유형을 다루는데,
 * 멘토링에는 대응하는 데이터가 **멘토링 유형(카테고리)뿐**이라 그 축만 노출한다.
 * (직무·커리어 단계는 `live_mentoring_opening` 에 컬럼 자체가 없다.)
 *
 * 데스크탑은 좌측 열, 모바일은 목록 위 가로 배치로 같은 마크업을 재사용한다.
 */
const LiveMentoringFilterSideBar = ({
  selected,
  onToggle,
}: LiveMentoringFilterSideBarProps) => (
  <aside className="w-full shrink-0 lg:w-[161px]">
    <h2 className="text-1-semibold text-neutral-0 mb-3 lg:mb-5">멘토링 유형</h2>
    <div className="flex flex-wrap gap-x-4 gap-y-3 lg:flex-col">
      {CATEGORY_FILTER_ORDER.map((category) => (
        <div
          key={category}
          onClick={() => onToggle(category)}
          className="flex cursor-pointer items-center gap-1 md:gap-3"
        >
          <img
            className="w-6 shrink-0"
            src={`/icons/${selected.includes(category) ? 'checkbox-fill.svg' : 'checkbox-fill-none.svg'}`}
            alt="체크박스"
          />
          <span className="text-xsmall16 text-neutral-35">
            {CATEGORY_LABELS[category]}
          </span>
        </div>
      ))}
    </div>
  </aside>
);

export default LiveMentoringFilterSideBar;
