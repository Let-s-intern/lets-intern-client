import { RefundMode } from '@/domain/admin/program/program-user/ui/RefundModal';
import { PassParticipant } from '@/domain/all-in-one-pass/types';
import dayjs from '@/lib/dayjs';

const periodKindLabel = (extendedDays: number | null, baseLabel: string) =>
  extendedDays == null ? baseLabel : `${extendedDays}일 연장`;

const SUB_HEAD =
  'border border-[#cbd5e0] bg-primary-10 px-3 py-2 text-center text-xs font-semibold text-neutral-600';
const SUB_CELL = 'border border-[#cbd5e0] px-3 py-2 text-center text-xs';

const BOLD_T = 'border-t-2 border-t-primary-40';
const BOLD_B = 'border-b-2 border-b-primary-40';
const BOLD_L = 'border-l-2 border-l-primary-40';
const BOLD_R = 'border-r-2 border-r-primary-40';

export const appAmount = (p: PassParticipant) =>
  p.isCanceled ? (p.originalPrice ?? p.finalPrice) : p.finalPrice;

interface Props {
  apps: PassParticipant[];
  onRefundClick: (participant: PassParticipant, mode: RefundMode) => void;
}

/** 참여자 건별(최초/연장) 내역 행들. 메인 테이블의 <tr> 로 직접 렌더해 컬럼 공유. */
export default function ParticipantDetailRows({ apps, onRefundClick }: Props) {
  // 기본 결제는 연장이 모두 환불돼야 환불 가능(BE 가드) → 미환불 연장 있으면 기본 환불 비활
  const hasUnrefundedExtension = apps.some(
    (p) => p.extendedDays != null && !p.isAdminRefunded,
  );
  return (
    <>
      <tr>
        <td />
        <td className={`${SUB_HEAD} ${BOLD_T} ${BOLD_L}`}>구분</td>
        <td className={`${SUB_HEAD} ${BOLD_T}`}>주문번호</td>
        <td className={`${SUB_HEAD} ${BOLD_T}`}>결제일</td>
        <td className={`${SUB_HEAD} ${BOLD_T}`}>쿠폰명</td>
        <td className={`${SUB_HEAD} ${BOLD_T}`}>결제금액</td>
        <td className={`${SUB_HEAD} ${BOLD_T}`}>관리</td>
        <td className={`${SUB_HEAD} ${BOLD_T} ${BOLD_R}`}>환불여부</td>
      </tr>
      {apps.map((p, index) => {
        const amount = appAmount(p);
        const isLast = index === apps.length - 1;
        const edge = isLast ? ` ${BOLD_B}` : '';

        return (
          <tr key={p.id}>
            <td />
            <td className={`${SUB_CELL} ${BOLD_L}${edge}`}>
              <span
                className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-xxsmall12 font-medium ${
                  p.extendedDays == null
                    ? 'border-neutral-70 text-neutral-40'
                    : 'border-primary text-primary'
                }`}
              >
                {periodKindLabel(p.extendedDays, '기본')}
              </span>
            </td>
            <td className={`${SUB_CELL} text-neutral-600${edge}`}>
              {p.orderId}
            </td>
            <td className={`${SUB_CELL} text-neutral-600${edge}`}>
              {dayjs(p.createDate).format('YYYY.MM.DD')}
            </td>
            <td className={`${SUB_CELL} text-neutral-600${edge}`}>
              {p.couponName ?? '없음'}
            </td>
            <td className={`${SUB_CELL}${edge}`}>
              {amount.toLocaleString()}원
            </td>
            <td className={`${SUB_CELL}${edge}`}>
              {p.isAdminRefunded ? (
                <span className="text-xs text-gray-400">환불완료</span>
              ) : p.extendedDays == null && hasUnrefundedExtension ? (
                <span className="text-xxsmall12 text-neutral-45">
                  연장 먼저 환불처리 필요
                </span>
              ) : (
                <div className="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => onRefundClick(p, 'full')}
                    className="whitespace-nowrap rounded border border-red-500 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    환불
                  </button>
                  <button
                    type="button"
                    onClick={() => onRefundClick(p, 'partial')}
                    className="whitespace-nowrap rounded border border-red-500 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    부분환불
                  </button>
                </div>
              )}
            </td>
            <td className={`${SUB_CELL} ${BOLD_R}${edge}`}>
              {p.isAdminRefunded ? (
                <span className="font-bold">Y</span>
              ) : (
                <span className="text-gray-300">N</span>
              )}
            </td>
          </tr>
        );
      })}
    </>
  );
}
