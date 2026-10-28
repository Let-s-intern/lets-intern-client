import type {
  MyOneTimeFormApplication,
  OneTimeFormInfo,
} from '@/api/one-time-form/oneTimeFormSchema';
import { useState } from 'react';
import FormPopupShell from '../../ui/FormPopupShell';
import {
  lineButtonClass,
  primaryButtonClass,
} from '../../ui/states/StateScreen';
import { formatWon } from '../../payment/utils/paymentAmount';
import {
  buildStatusNotice,
  deriveMyApplicationStatus,
} from '../utils/myApplication';
import {
  ApplicationContentCard,
  PaymentInfoCard,
} from './ApplicationInfoCards';

interface MyApplicationDetailProps {
  /** U1 이 404(비공개로 바뀐 폼)면 없다. 그때는 상품 카드 없이 상태만 보인다 */
  form?: Pick<OneTimeFormInfo, 'title' | 'scheduleText' | 'thumbnailUrl'>;
  application: NonNullable<MyOneTimeFormApplication>;
  /** "신청 취소" 버튼. 취소 확인 바텀시트를 연다 */
  onCancelRequest: () => void;
  onClose: () => void;
}

/** 신청 확인 화면(시안 5절). 취소 가능·마감 후·취소됨 세 상태를 그린다 */
const MyApplicationDetail = ({
  form,
  application,
  onCancelRequest,
  onClose,
}: MyApplicationDetailProps) => {
  const status = deriveMyApplicationStatus(application);
  const isCanceled = status === 'CANCELED';
  // 마감 후는 안내를 먼저 보이고 내용은 접어 둔다(시안 5절 "신청 내용 보기")
  const [isDetailOpen, setIsDetailOpen] = useState(status !== 'PAST_DEADLINE');
  const productMeta =
    status === 'PAST_DEADLINE' && application.payment
      ? `${formatWon(application.payment.paidAmount)} 결제`
      : form?.scheduleText;

  return (
    <FormPopupShell
      title="신청 확인"
      footer={
        status === 'CANCELABLE' ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancelRequest}
              className={lineButtonClass}
            >
              신청 취소
            </button>
            <button
              type="button"
              onClick={onClose}
              className={primaryButtonClass}
            >
              닫기
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className={primaryButtonClass}
          >
            닫기
          </button>
        )
      }
    >
      <section className="bg-primary-5 flex gap-3.5 rounded-md p-4">
        {form ? (
          form.thumbnailUrl ? (
            // 썸네일 호스트가 S3 이므로 next/image 원격 설정 없이 img 를 쓴다
            <img
              src={form.thumbnailUrl}
              alt={form.title}
              className="h-16 w-16 flex-none rounded-sm object-cover"
            />
          ) : (
            <div
              aria-hidden
              className="bg-gradient-start h-16 w-16 flex-none rounded-sm"
            />
          )
        ) : null}
        <div className="min-w-0">
          <span
            className={`text-xxsmall12 rounded-xxs inline-block px-2 py-0.5 font-semibold ${
              isCanceled
                ? 'bg-neutral-90 text-neutral-40'
                : 'bg-primary-10 text-primary'
            }`}
          >
            {isCanceled ? '취소됨' : '신청 완료'}
          </span>
          {form ? (
            <h2 className="text-xsmall16 mt-1.5 font-bold">{form.title}</h2>
          ) : null}
          {productMeta ? (
            <p className="text-xxsmall12 text-neutral-40 mt-1">{productMeta}</p>
          ) : null}
        </div>
      </section>

      {status === 'PAST_DEADLINE' ? (
        <StatusNotice text={buildStatusNotice(application)} />
      ) : null}

      {isDetailOpen ? (
        <div className="mt-4 space-y-3">
          <PaymentInfoCard application={application} />
          <ApplicationContentCard application={application} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsDetailOpen(true)}
          className="text-xsmall14 text-neutral-40 mx-auto mt-4 block underline underline-offset-2"
        >
          신청 내용 보기
        </button>
      )}

      {status !== 'PAST_DEADLINE' ? (
        <StatusNotice text={buildStatusNotice(application)} />
      ) : null}
    </FormPopupShell>
  );
};

const StatusNotice = ({ text }: { text: string }) => (
  <p className="bg-neutral-95 text-xxsmall12 text-neutral-35 mt-3 break-keep rounded-sm px-3.5 py-3 leading-relaxed">
    {text}
  </p>
);

export default MyApplicationDetail;
