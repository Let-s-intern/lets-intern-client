import { Link } from 'react-router-dom';

/**
 * 사이드바 "통계" 진입점(나가기 바로 위).
 * 드롭다운 없이 클릭 시 통계 페이지(/stats)로 이동하며, 항목 선택은 페이지 상단 탭에서 한다.
 */
const StatsEmbedSection = () => (
  <div>
    <Link
      to="/stats"
      className="flex w-full items-center justify-between border-b border-b-neutral-600 pb-3 pl-4 pr-8 hover:text-neutral-300"
    >
      <h3 className="text-xsmall16 font-medium">통계</h3>
    </Link>
  </div>
);

export default StatsEmbedSection;
