import { twMerge } from '@/lib/twMerge';
import { Link } from 'react-router-dom';
import { PaymentType } from '../../../../api/paymentSchema';
import CardStatus from './CardStatus';

const CreditListItem = ({ payment }: { payment: PaymentType }) => {
  return (
    <Link
      className="flex w-full flex-col items-start justify-center gap-y-2"
      to={
        payment.programInfo.programType === 'REPORT'
          ? `/mypage/credit/report/${payment.programInfo.paymentId}?applicationId=${payment.programInfo.applicationId}`
          : `/mypage/credit/${payment.programInfo.paymentId}`
      }
      data-program-text={payment.programInfo.title}
    >
      <CardStatus
        status={
          payment.programInfo.isRefunded
            ? 'REFUNDED'
            : payment.tossInfo && payment.tossInfo.status
              ? payment.tossInfo.status === 'DONE'
                ? 'DONE'
                : 'CANCELED'
              : payment.programInfo.isCanceled
                ? 'CANCELED'
                : 'DONE'
        }
      />
      <div className="flex w-full items-center gap-x-[14px]">
        <img
          alt="thumbnail"
          src={
            payment.programInfo.programType === 'REPORT'
              ? '/images/report-banner.jpg'
              : payment.programInfo.thumbnail || ''
          }
          className={twMerge(
            'h-[97px] w-[137px] rounded-sm object-cover',
            ((payment.tossInfo && payment.tossInfo?.status !== 'DONE') ||
              payment.programInfo.isCanceled) &&
              'grayscale',
          )}
        />
        <div className="flex grow flex-col items-start justify-between gap-2 self-stretch">
          <div className="text-xs font-semibold text-neutral-0 md:text-sm">
            {payment.programInfo.title}
          </div>
          <div className="flex grow flex-col items-start justify-start">
            <div className="text-xs font-medium text-neutral-40 line-through">
              {payment.programInfo.price?.toLocaleString()}원
            </div>
            <div className="text-sm font-semibold text-neutral-0 md:text-base">
              {payment.tossInfo && payment.tossInfo.totalAmount
                ? payment.tossInfo.totalAmount.toLocaleString()
                : 0}
              원
            </div>
          </div>
          <button className="flex items-center justify-start text-xs font-semibold text-primary md:text-sm">
            결제상세
            <img
              alt="chevron-right"
              src="/icons/Chevron_Right_MD_primary.svg"
              className="h-4 w-4"
            />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CreditListItem;
