import type {
  AdminCurrentOpening,
  LiveMentoringApplicationStatus,
  LiveMentoringCategory,
  LiveMentoringCloseReason,
  LiveMentoringStatus,
} from '@/api/live-mentoring/liveMentoringSchema';

export const CATEGORY_LABELS: Record<LiveMentoringCategory, string> = {
  PERSONAL_STATEMENT: '자기소개서',
  RESUME: '이력서',
  PORTFOLIO: '포트폴리오',
};

/*
 * 상태 표기.
 *
 * 승인 절차가 사라진 뒤로(LC-3262) 새 상품은 만들어지는 순간부터 APPROVED 다.
 * 그런데 화면에 「승인」이라고 적으면 아직 승인 단계가 있는 것처럼 읽혀, 운영자가
 * 어디서 승인하는지 찾게 된다. 운영에서 부르는 말인 「오픈 중」으로 적는다.
 *
 * 주의 — 이 값은 **상품 상태**지 개설(opening) 상태가 아니다. 개설이 하나도 열려 있지
 * 않은 상품도 APPROVED 다. 실제로 지금 열려 있는지는 표의 개설 칸이 따로 보여준다.
 *
 * DRAFT 는 승인 절차가 있던 시절의 기존 행만 갖고 있다(서버 `LiveMentoringStatus`).
 * 새로 생기지 않으므로 옛 데이터임이 드러나게 적는다.
 */
export const STATUS_LABELS: Record<LiveMentoringStatus, string> = {
  DRAFT: '초안(옛 데이터)',
  APPROVED: '오픈 중',
  INACTIVE: '비활성',
};

export const STATUS_CLASSES: Record<LiveMentoringStatus, string> = {
  DRAFT: 'bg-neutral-95 text-neutral-40',
  APPROVED: 'bg-primary-10 text-primary',
  INACTIVE: 'bg-neutral-95 text-neutral-40',
};

/** 신청 상태. 서버 `LiveMentoringApplicationStatus` 의 desc 를 그대로 쓴다. */
export const APPLICATION_STATUS_LABELS: Record<
  LiveMentoringApplicationStatus,
  string
> = {
  PAYMENT_PENDING: '결제 대기',
  EXPIRED: '선점 만료',
  CANCELED: '신청 취소',
  CONFIRMED: '결제 완료',
};

export const CLOSE_REASON_LABELS: Record<LiveMentoringCloseReason, string> = {
  PERIOD_EXPIRED: '기간 만료',
  ADMIN_FORCED: '관리자 종료',
  MENTOR_CANCELED: '멘토 취소',
};

/**
 * 상태 필터 선택지. `undefined` 는 파라미터를 아예 보내지 않는 전체 조회다.
 *
 * 「초안」은 빼 뒀다. 새로 생기지 않는 옛 값이라 골라 봐야 걸리는 게 없거나 아주 오래된
 * 몇 행뿐이고, 그것들도 전체 조회에 함께 나온다. 지금 갈라 볼 의미가 있는 것은
 * 쓰는 상품과 더 쓰지 않는 상품이다.
 */
export const STATUS_FILTERS: {
  label: string;
  value: LiveMentoringStatus | undefined;
}[] = [
  { label: '전체', value: undefined },
  { label: '오픈 중', value: 'APPROVED' },
  { label: '비활성', value: 'INACTIVE' },
];

/**
 * 공개 상세 페이지 주소.
 *
 * 서버 공개 상세 조회는 상품 상태를 검사하지 않아 승인 전에도 열린다.
 * 운영자가 실제 화면을 직접 확인할 수 있어야 한다.
 */
export const publicDetailUrl = (mentorId: number): string =>
  `${import.meta.env.VITE_WEB_URL ?? ''}/live-mentoring/${mentorId}`;

export const formatPrice = (price: number): string =>
  `${price.toLocaleString('ko-KR')}원`;

/** "2026-08-04T14:30:00" → "2026-08-04 14:30". 값이 없으면 하이픈. */
export const formatDateTime = (value: string | null): string => {
  if (!value) return '-';
  const [date, time] = value.split('T');
  return `${date} ${time?.slice(0, 5) ?? ''}`.trim();
};

/** 진행시간별 가격 (예: "30분 35,000원 / 60분 60,000원"). */
export const durationPricesLabel = (
  durationPrices: AdminCurrentOpening['durationPrices'],
): string =>
  durationPrices
    .map(({ duration, price }) => `${duration}분 ${formatPrice(price)}`)
    .join(' / ');
