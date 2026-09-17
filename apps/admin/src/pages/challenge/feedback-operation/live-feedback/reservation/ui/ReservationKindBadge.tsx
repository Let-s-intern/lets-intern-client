import { twMerge } from '@/lib/twMerge';
import {
  RESERVATION_KIND_LABEL,
  type ReservationKind,
} from '../utils/reservationRow';

/**
 * 예약 유형 색. 새 색을 정하지 않고 후기 배지(`domain/review/ReviewBadge`)가 프로그램
 * 종류에 이미 쓰는 색을 따른다 — 챌린지는 primary, LIVE 는 tertiary.
 * 그쪽 LIVE 배경은 헥스라 같은 색의 투명도 토큰으로 바꿔 쓴다.
 */
const KIND_BADGE_CLASS: Record<ReservationKind, string> = {
  CHALLENGE: 'bg-primary-10 text-primary',
  LIVE_MENTORING: 'bg-tertiary/10 text-tertiary',
};

/**
 * 예약 유형 배지.
 *
 * 같은 표의 `StatusBadge`(진리표 뱃지)는 색·테두리 없는 글자만 쓴다. 이 배지는 두 유형을
 * 색으로 가르는 다른 개념이라 따로 둔다.
 */
export default function ReservationKindBadge({
  kind,
}: {
  kind: ReservationKind;
}) {
  return (
    <span
      className={twMerge(
        'rounded-xxs text-xsmall14 inline-flex items-center whitespace-nowrap px-2 py-1 font-bold',
        KIND_BADGE_CLASS[kind],
      )}
    >
      {RESERVATION_KIND_LABEL[kind]}
    </span>
  );
}
