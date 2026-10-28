import type { OneTimeFormDraft } from '../../utils/applicationDraft';
import PaymentCard, { PaymentRow } from './PaymentCard';

interface ApplicantSummaryCardProps {
  applicant: Pick<OneTimeFormDraft, 'name' | 'email' | 'phoneNum'>;
  /** 정보 입력 단계로 돌아간다. 보관한 입력값이 그대로 채워진다 */
  onEdit: () => void;
}

const ApplicantSummaryCard = ({
  applicant,
  onEdit,
}: ApplicantSummaryCardProps) => (
  <PaymentCard
    title="신청자 정보"
    action={
      <button
        type="button"
        onClick={onEdit}
        className="text-xxsmall12 text-neutral-40 font-medium underline"
      >
        수정
      </button>
    }
  >
    <dl className="space-y-2">
      <PaymentRow label="이름" value={applicant.name} />
      <PaymentRow label="이메일" value={applicant.email} />
      <PaymentRow label="전화번호" value={applicant.phoneNum} />
    </dl>
  </PaymentCard>
);

export default ApplicantSummaryCard;
