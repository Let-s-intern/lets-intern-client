import type {
  AdminCurrentOpening,
  LiveMentoringCategory,
  LiveMentoringCloseReason,
  LiveMentoringStatus,
} from '@/api/live-mentoring/liveMentoringSchema';

export const CATEGORY_LABELS: Record<LiveMentoringCategory, string> = {
  PERSONAL_STATEMENT: '자기소개서',
  RESUME: '이력서',
  PORTFOLIO: '포트폴리오',
};

export const STATUS_LABELS: Record<LiveMentoringStatus, string> = {
  DRAFT: '초안',
  PENDING_REVIEW: '검토 대기',
  APPROVED: '승인',
  REJECTED: '반려',
  INACTIVE: '비활성',
};

export const STATUS_CLASSES: Record<LiveMentoringStatus, string> = {
  DRAFT: 'bg-neutral-95 text-neutral-40',
  PENDING_REVIEW: 'bg-amber-50 text-amber-700',
  APPROVED: 'bg-primary-10 text-primary',
  REJECTED: 'bg-red-50 text-red-600',
  INACTIVE: 'bg-neutral-95 text-neutral-40',
};

export const CLOSE_REASON_LABELS: Record<LiveMentoringCloseReason, string> = {
  PERIOD_EXPIRED: '기간 만료',
  ADMIN_FORCED: '관리자 종료',
  MENTOR_CANCELED: '멘토 취소',
};

/** 상태 필터 선택지. `undefined` 는 파라미터를 아예 보내지 않는 전체 조회다. */
export const STATUS_FILTERS: {
  label: string;
  value: LiveMentoringStatus | undefined;
}[] = [
  { label: '검토 대기', value: 'PENDING_REVIEW' },
  { label: '승인', value: 'APPROVED' },
  { label: '반려', value: 'REJECTED' },
  { label: '초안', value: 'DRAFT' },
  { label: '비활성', value: 'INACTIVE' },
  { label: '전체', value: undefined },
];

export const formatPrice = (price: number): string =>
  `${price.toLocaleString('ko-KR')}원`;

/** "2026-08-04T14:30:00" → "2026-08-04 14:30". 값이 없으면 하이픈. */
export const formatDateTime = (value: string | null): string => {
  if (!value) return '-';
  const [date, time] = value.split('T');
  return `${date} ${time?.slice(0, 5) ?? ''}`.trim();
};

export const formatPeriod = (start: string, end: string): string =>
  `${start} ~ ${end}`;

/** 진행시간별 가격 (예: "30분 35,000원 / 60분 60,000원"). */
export const durationPricesLabel = (
  durationPrices: AdminCurrentOpening['durationPrices'],
): string =>
  durationPrices
    .map(({ duration, price }) => `${duration}분 ${formatPrice(price)}`)
    .join(' / ');

const todayISO = () => new Date().toISOString().slice(0, 10);

/**
 * 기간이 이미 지났는지.
 *
 * 승인은 저장된 종료일이 오늘 이전이면 서버가 409 로 막는다. 목록에서 미리 구분해 두지 않으면
 * 운영자가 승인 버튼을 눌러본 뒤에야 실패를 알게 된다.
 */
export const isExpired = (endDate: string | null | undefined): boolean =>
  !!endDate && endDate < todayISO();
