import type { FeedbackRow } from '../types';
import FeedbackTableRow from './FeedbackTableRow';

const HEADERS = [
  '구분',
  '피드백 상태',
  '멘티 예약',
  '멘티 제출',
  '멘티',
  '멘토',
  '챌린지',
  '미션 회차',
  '피드백 일정',
  '멘티 성명',
  '상세',
] as const;

interface FeedbackTableProps {
  rows: FeedbackRow[];
  onClickDetail: (row: FeedbackRow) => void;
}

/**
 * 11컬럼 통합 표.
 * 모바일에서는 부모 컨테이너가 가로 스크롤을 처리한다 (`overflow-x-auto`).
 */
const FeedbackTable = ({ rows, onClickDetail }: FeedbackTableProps) => {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white py-12 text-center text-sm text-gray-400">
        표시할 피드백이 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full min-w-[1080px] border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500">
            {HEADERS.map((header) => (
              <th key={header} className="px-3 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <FeedbackTableRow
              key={row.id}
              row={row}
              onClickDetail={onClickDetail}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackTable;
