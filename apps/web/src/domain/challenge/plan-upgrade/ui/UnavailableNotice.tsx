import type { PlanUpgradeUnavailableReason } from '../api/planUpgradeSchema';
import { unavailableReasonText } from '../utils/planUpgradeText';

interface UnavailableNoticeProps {
  reason: PlanUpgradeUnavailableReason;
  deadline?: string | null;
}

/** 업그레이드가 막혔을 때 선택지·혜택·금액 대신 보이는 안내 */
const UnavailableNotice = ({ reason, deadline }: UnavailableNoticeProps) => (
  <p className="bg-neutral-95 text-xsmall16 rounded-md px-5 py-6 text-center">
    {unavailableReasonText(reason, deadline)}
  </p>
);

export default UnavailableNotice;
