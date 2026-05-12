import type { MagnetApplicationByMagnet } from '@/api/leadManagement';
import { useMemo } from 'react';

import { getPercentColor } from '../utils/percentColor';
import { questionAnswerStat } from '../utils/questionAnswerStat';

interface QuestionAnswerStatProps {
  applications: MagnetApplicationByMagnet[];
}

/**
 * 마그넷 신청자의 질문 답변률 KPI (인라인).
 *
 * - `applications.length === 0`이면 `null`을 반환한다.
 * - 외곽 카드 컨테이너는 페이지의 결합 카드가 제공한다. 본 컴포넌트는 KPI 마크업만 렌더한다.
 * - 통계는 응답 원본 기준으로 고정되며 DataGrid 필터에 반응하지 않는다.
 */
const QuestionAnswerStat = ({ applications }: QuestionAnswerStatProps) => {
  // strictNullChecks 미활성 환경에서 z.infer가 questionAnswerList를 optional로 추론하므로,
  // questionAnswerStat 시그니처에 맞게 빈 배열로 안전 매핑한다.
  const stat = useMemo(
    () =>
      questionAnswerStat(
        applications.map((a) => ({
          questionAnswerList: a.questionAnswerList ?? [],
        })),
      ),
    [applications],
  );

  if (applications.length === 0) return null;

  return (
    <div>
      <p className="mb-1 text-sm text-gray-700">질문 응답률</p>
      <p
        className="text-2xl font-bold"
        style={{ color: getPercentColor(stat.percent) }}
      >
        {stat.percent}%
      </p>
      <p className="text-xs text-gray-500">
        {stat.answered} / {stat.total}명
      </p>
    </div>
  );
};

export default QuestionAnswerStat;
