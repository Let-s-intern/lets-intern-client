import type { OneTimeFormInfo } from '@/api/one-time-form/oneTimeFormSchema';
import { Clock } from 'lucide-react';
import { formatApplyPeriod, formatMonthDay } from '../../utils/applyPeriodText';
import StateScreen, { closePopup, lineButtonClass } from './StateScreen';

interface ApplyPeriodStateProps {
  form: Pick<OneTimeFormInfo, 'applyStatus' | 'startDate' | 'endDate'>;
}

/** 신청 기간 밖. 시작 전이면 시작일을, 지났으면 마감을 알린다 */
const ApplyPeriodState = ({ form }: ApplyPeriodStateProps) => (
  <StateScreen
    icon={<Clock size={28} />}
    heading={
      form.applyStatus === 'BEFORE'
        ? `${formatMonthDay(form.startDate)}부터 신청할 수 있어요`
        : '신청이 마감됐어요'
    }
    description={`신청 기간 ${formatApplyPeriod(form.startDate, form.endDate)}`}
    footer={
      <button type="button" onClick={closePopup} className={lineButtonClass}>
        닫기
      </button>
    }
  />
);

export default ApplyPeriodState;
