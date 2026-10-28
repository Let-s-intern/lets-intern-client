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
    <div className="border-neutral-80 rounded-md border p-6">
      <p className="text-xsmall14 text-neutral-40">
        신청일 {formatSubmittedDate(submittedAt)}
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="text-small20 text-primary font-bold">
          {STATUS_LABEL[status]}
        </p>
        {showReplyDate ? (
          <span className="bg-primary-10 text-xxsmall12 text-primary-dark inline-flex items-center gap-1.5 rounded-full px-3 py-1">
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
