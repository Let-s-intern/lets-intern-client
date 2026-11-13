import dayjs from '@/lib/dayjs';

import { AiChatPeriod, AiChatPrice } from '../types/aiChat';

export function formatWon(value: number) {
  return value === 0 ? '무료' : `${value.toLocaleString('ko-KR')}원`;
}

/** 예: 83,500원 (베이직 기준) */
export function formatPriceText(price: AiChatPrice) {
  const base = formatWon(price.selling);
  return price.note ? `${base} (${price.note})` : base;
}

function formatDate(value: string | null) {
  return value ? dayjs(value).format('M.D(dd)') : '';
}

/** 예: 11.12(수) ~ 11.23(일), 시작일이 없으면 ~ 11.23(일) */
export function formatPeriod(period: AiChatPeriod | null) {
  if (!period || (!period.start && !period.end)) return null;
  return `${formatDate(period.start)} ~ ${formatDate(period.end)}`.trim();
}
