import type { MentorApplicationStatus } from '@/api/mentor-application/mentorApplication';

import { STATUS_LABEL } from '../constants/status';
import {
  formatReplyDate,
  formatSubmittedDate,
} from '../utils/formatStatusDate';
import StatusStepper from './StatusStepper';

interface StatusResultCardProps {
  application: MentorApplicationStatus;
}

/** 신청 한 건의 신청일, 상태, 예상 회신일, 진행 표시. 회신 완료면 예상 회신일을 숨긴다 */
export default function StatusResultCard({
  application: { submittedAt, status, expectedReplyDate },
}: StatusResultCardProps) {
  const showReplyDate = status !== 'REPLIED' && !!expectedReplyDate;

  return (
    <div className="rounded-[12px] border border-zinc-200 p-6">
      <p className="text-sm text-zinc-500">
        신청일 {formatSubmittedDate(submittedAt)}
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="text-xl font-bold text-[#4d55f5]">
          {STATUS_LABEL[status]}
        </p>
        {showReplyDate ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef0ff] px-3 py-1 text-xs text-[#3a41d6]">
            예상 회신일
            <span className="font-semibold">
              {formatReplyDate(expectedReplyDate)}
            </span>
          </span>
        ) : null}
      </div>
      <StatusStepper status={status} />
    </div>
  );
}
