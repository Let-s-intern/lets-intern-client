import { PaymentType, ProgramInfoType } from '@/api/payment/paymentSchema';
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

/*
  1대1 라이브 멘토링은 `applicationId` 체계이고 취소 수수료 규칙이 다르다.
  리포트가 이미 전용 경로로 갈라져 있는 것과 같은 방식으로 분리한다 —
  기존 화면에 분기를 넣으면 프로그램·리포트 결제가 함께 흔들린다.
*/
export const getCreditDetailHref = (programInfo: ProgramInfoType) =>
  programInfo.programType === 'REPORT'
    ? `/mypage/credit/report/${programInfo.paymentId}?applicationId=${programInfo.applicationId}`
    : programInfo.programType === 'LIVE_MENTORING'
      ? `/mypage/credit/live-mentoring/${programInfo.applicationId}`
      : `/mypage/credit/${programInfo.paymentId}`;

export default function CreditListItem({
  payment: { programInfo, tossInfo },
}: {
  payment: PaymentType;
}) {
  /*
    VOD 이용권 행의 `tossInfo` 는 챌린지와 함께 결제한 PG 거래 전체다.
    그 합계는 이 행의 금액이 아니므로 이 신청에 결제된 `paidAmount` 를 쓰고,
    `price` 가 무엇인지 확인되지 않아 정가는 그리지 않는다.
  */
  const isVodPass = programInfo.programType === 'VOD_PASS';
  const paidAmount =
    isVodPass && typeof programInfo.paidAmount === 'number'
      ? programInfo.paidAmount
      : tossInfo?.totalAmount;

  // 정가
  const originPrice =
    (programInfo.price ?? 0) +
    (programInfo.paybackPrice ?? 0) +
    (programInfo.optionPrice ?? 0);

  return (
    <Link
      className="flex w-full flex-col items-start justify-center gap-y-2"
      href={getCreditDetailHref(programInfo)}
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
          <div className="text-neutral-0 text-xs font-semibold md:text-sm">
            {programInfo.title}
          </div>
          <div className="flex grow flex-col items-start justify-start">
            {/* 할인 없으면 정가 숨기기 */}
            {!isVodPass && originPrice !== tossInfo?.totalAmount && (
              <div className="text-neutral-40 text-xs font-medium line-through">
                {originPrice.toLocaleString()}원
              </div>
            )}
            <div className="text-neutral-0 text-sm font-semibold md:text-base">
              {paidAmount ? paidAmount.toLocaleString() : 0}원
            </div>
          </div>
          <button className="text-primary flex items-center justify-start text-xs font-semibold md:text-sm">
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
}
