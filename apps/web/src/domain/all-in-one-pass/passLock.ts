import dayjs from '@/lib/dayjs';

/** 패스 이용기간(startDate~endDate) 밖이면 탭 잠금(UI). 데이터 차단은 BE(accessible/403). */
export const isPassLocked = (
  startDate?: string | null,
  endDate?: string | null,
) => {
  if (!startDate || !endDate) return false;
  const now = dayjs();
  return now.isBefore(dayjs(startDate)) || now.isAfter(dayjs(endDate));
};
