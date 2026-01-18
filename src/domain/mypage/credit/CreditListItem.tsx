import { PaymentType } from '@/api/payment/paymentSchema';
import { ReportType } from '@/api/report';
import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import CardStatus from './CardStatus';

export const getReportThumbnail = (reportType: ReportType | null) => {
  switch (reportType) {
    case 'RESUME':
      return '/images/report/thumbnail_resume.png';
    case 'PERSONAL_STATEMENT':
      return '/images/report/thumbnail_personal.png';
    case 'PORTFOLIO':
      return '/images/report/thumbnail_portfolio.png';
    default:
      return '/images/report-banner.jpg';
  }
};

const CreditListItem = ({
  payment: { programInfo, tossInfo },
}: {
  payment: PaymentType;
}) => {
  // 정가
  const originPrice =
    (programInfo.price ?? 0) +
    (programInfo.paybackPrice ?? 0) +
    (programInfo.optionPrice ?? 0);

  return (
    <Link
      className="flex w-full flex-col items-start justify-center gap-y-2"
      href={
        programInfo.programType === 'REPORT'
          ? `/mypage/credit/report/${programInfo.paymentId}?applicationId=${programInfo.applicationId}`
          : `/mypage/credit/${programInfo.paymentId}`
      }
      data-program-text={programInfo.title}
    >
      <CardStatus
        status={
          programInfo.isRefunded
            ? 'REFUNDED'
            : tossInfo && tossInfo.status
              ? tossInfo.status === 'DONE'
                ? 'DONE'
                : 'CANCELED'
              : programInfo.isCanceled
                ? 'CANCELED'
                : 'DONE'
        }
      />
      <div className="flex w-full items-center gap-x-[14px]">
        <img
          alt="thumbnail"
          src={
            programInfo.programType === 'REPORT'
              ? getReportThumbnail(programInfo.reportType || null)
              : programInfo.thumbnail || ''
          }
          className={twMerge(
            'h-[97px] w-[137px] rounded-sm object-cover',
            ((tossInfo && tossInfo?.status !== 'DONE') ||
              programInfo.isCanceled) &&
              'grayscale',
          )}
        />
        <div className="flex grow flex-col items-start justify-between gap-2 self-stretch">
          <div className="text-xs font-semibold text-neutral-0 md:text-sm">
            {programInfo.title}
          </div>
          <div className="flex grow flex-col items-start justify-start">
            {/* 할인 없으면 정가 숨기기 */}
            {originPrice !== tossInfo?.totalAmount && (
              <div className="text-xs font-medium text-neutral-40 line-through">
                {originPrice.toLocaleString()}원
              </div>
            )}
            <div className="text-sm font-semibold text-neutral-0 md:text-base">
              {tossInfo && tossInfo.totalAmount
                ? tossInfo.totalAmount.toLocaleString()
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
