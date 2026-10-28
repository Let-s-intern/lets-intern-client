import type { MyOneTimeFormApplication } from '@/api/one-time-form/oneTimeFormSchema';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { formatDotDate } from '../../utils/applyPeriodText';
import StateScreen, {
  closePopup,
  lineButtonClass,
  primaryButtonClass,
} from './StateScreen';

interface AlreadyAppliedStateProps {
  slug: string;
  application: Pick<
    NonNullable<MyOneTimeFormApplication>,
    'createDate' | 'payment'
  >;
}

/** 취소하지 않은 신청이 있다. 확인과 취소는 /form/{slug}/my 에서 한다 */
const AlreadyAppliedState = ({
  slug,
  application,
}: AlreadyAppliedStateProps) => {
  const appliedText = application.payment
    ? `${formatDotDate(application.createDate)} 신청 · ${application.payment.paidAmount.toLocaleString('ko-KR')}원 결제`
    : `${formatDotDate(application.createDate)} 신청`;

  return (
    <StateScreen
      icon={<Check size={30} strokeWidth={2.4} />}
      tone="ok"
      heading="이미 신청했어요"
      description={
        <>
          {appliedText}
          <br />
          신청 내용 확인과 취소는 신청 확인 페이지에서 할 수 있어요.
        </>
      }
      footer={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={closePopup}
            className={`${lineButtonClass} w-28 flex-none`}
          >
            닫기
          </button>
          <Link href={`/form/${slug}/my`} className={primaryButtonClass}>
            신청 확인하기
          </Link>
        </div>
      }
    />
  );
};

export default AlreadyAppliedState;
