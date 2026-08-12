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
  APPROVED: '승인',
  INACTIVE: '비활성',
};

export const STATUS_CLASSES: Record<LiveMentoringStatus, string> = {
  DRAFT: 'bg-neutral-95 text-neutral-40',
  APPROVED: 'bg-primary-10 text-primary',
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
  { label: '전체', value: undefined },
  { label: '초안', value: 'DRAFT' },
  { label: '승인', value: 'APPROVED' },
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

export const formatPeriod = (start: string, end: string): string =>
  `${start} ~ ${end}`;

/** 진행시간별 가격 (예: "30분 35,000원 / 60분 60,000원"). */
export const durationPricesLabel = (
  durationPrices: AdminCurrentOpening['durationPrices'],
): string =>
  durationPrices
    .map(({ duration, price }) => `${duration}분 ${formatPrice(price)}`)
    .join(' / ');
