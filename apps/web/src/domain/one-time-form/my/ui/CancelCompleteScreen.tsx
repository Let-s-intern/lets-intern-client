import type { MyOneTimeFormApplication } from '@/api/one-time-form/oneTimeFormSchema';
import { Check } from 'lucide-react';
import { formatWon } from '../../payment/utils/paymentAmount';
import StateScreen, { lineButtonClass } from '../../ui/states/StateScreen';
import { formatDotDateTime } from '../utils/myApplication';

interface CancelCompleteScreenProps {
  application: NonNullable<MyOneTimeFormApplication>;
  onClose: () => void;
}

/**
 * 취소 완료 화면(시안 5절 "취소 완료"). 취소 일시는 다시 불러온 U2 의 canceledAt 이다.
 * 0원·무료는 돌려줄 돈이 없어 환불 문장을 뺀다.
 */
const CancelCompleteScreen = ({
  application,
  onClose,
}: CancelCompleteScreenProps) => {
  const paidAmount = application.payment?.paidAmount ?? 0;
  const { canceledAt } = application;

  return (
    <StateScreen
      title="신청 확인"
      icon={<Check size={28} strokeWidth={2.2} />}
      heading="신청을 취소했어요"
      description={
        <>
          {paidAmount > 0 ? (
            <>
              {formatWon(paidAmount)}을 결제한 수단으로 돌려드려요.
              <br />
            </>
          ) : null}
          {canceledAt ? `${formatDotDateTime(canceledAt)} 취소` : null}
        </>
      }
      footer={
        <button type="button" onClick={onClose} className={lineButtonClass}>
          닫기
        </button>
      }
    />
  );
};

export default CancelCompleteScreen;
