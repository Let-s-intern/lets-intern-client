import { twMerge } from '@/lib/twMerge';

import type { PeriodBarData } from '../../types';

/** 신청 시 낸 질문·전달 파일을 한 줄로 요약한다. 빈 칸을 남기지 않는다. */
function submissionSummary(
  questionWritten: boolean,
  attachmentSubmitted: boolean,
): string {
  if (questionWritten && attachmentSubmitted) return '질문·파일 제출';
  if (questionWritten) return '질문만 제출';
  if (attachmentSubmitted) return '파일만 제출';
  return '미제출';
}

/**
 * 시간별 일정(하단) 안에서 시간순으로 쌓이는 1대1 라이브 멘토링 예약 카드.
 *
 * 라이브 피드백 카드(`LiveFeedbackTimeBlock`)와 같은 자리에 놓이므로 색과 라벨로 가른다 —
 * 라이브 피드백은 흰 배경 + 빨강 LIVE 표시, 1대1은 primary 톤 배경 + 테두리다.
 *
 * **표시만 한다.** 멘토가 열 수 있는 상세 화면이 아직 없어 클릭 핸들러를 붙이지 않는다.
 */
const LiveMentoringCard = ({ bar }: { bar: PeriodBarData }) => {
  const lm = bar.liveMentoring;
  if (!lm) return null;

  return (
    <div
      className={twMerge(
        'flex h-full w-full flex-col gap-1.5 overflow-hidden rounded-md border border-primary-20 bg-primary-5 px-2.5 py-2',
      )}
    >
      {/* Row 1: 시작 시간 + 진행시간 */}
      <div className="flex items-center justify-between gap-1">
        <span className="shrink-0 text-sm font-bold leading-none text-neutral-10">
          {lm.startTime}
        </span>
        <span className="shrink-0 whitespace-nowrap rounded-[4px] bg-primary-10 px-1.5 py-0.5 text-[10px] font-medium leading-none text-primary">
          {lm.durationMinutes}분
        </span>
      </div>

      {/* Row 2: 1대1 라이브 멘토링 라벨 */}
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
        <span className="shrink-0 text-xxsmall12 font-bold leading-none text-primary">
          {bar.challengeTitle}
        </span>
      </div>

      {/* Row 3: 멘티명 */}
      <span className="min-w-0 truncate text-xxsmall12 leading-tight text-neutral-40">
        {lm.menteeName} 멘티
      </span>

      {/* Row 4: 멘티가 낸 것 — 빈 줄을 남기지 않는다 */}
      <span className="min-w-0 truncate text-xxsmall12 leading-tight text-neutral-40">
        {submissionSummary(lm.questionWritten, lm.attachmentSubmitted)}
      </span>
    </div>
  );
};

export default LiveMentoringCard;
