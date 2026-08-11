import dayjs from '@/lib/dayjs';

/**
 * 이용 시각 표기 (LC-3201).
 *
 * 목록 행과 펼친 상세 행이 **같은 순간을 같은 모양으로** 찍어야 한다.
 * 두 곳에 따로 적어 두면 한쪽 형식만 바뀌었을 때 같은 시각이 다른 값처럼 보이고,
 * 결제일과 이용 시각을 눈으로 비교하는 화면에서 그 어긋남이 곧 오독으로 이어진다.
 *
 * 값이 없으면 빈칸이 아니라 `-` 를 남긴다. 빈칸은 칸이 밀린 것처럼 읽힌다.
 */
export const formatDateTime = (value: string | null | undefined): string =>
  value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '-';
