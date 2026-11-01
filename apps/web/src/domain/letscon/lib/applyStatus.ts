import type { Dayjs } from 'dayjs';

export type LetsconApplyStatus =
  | 'loading'
  | 'available'
  | 'applied'
  | 'closed'
  | 'unavailable'; // 라이브 ID 가 없거나 정보를 불러오지 못했다

interface GetApplyStatusParams {
  hasLiveId: boolean;
  isLoading: boolean;
  hasLiveInfo: boolean;
  applied: boolean;
  deadline: Dayjs | null;
  now: Dayjs;
}

export const getApplyStatus = ({
  hasLiveId,
  isLoading,
  hasLiveInfo,
  applied,
  deadline,
  now,
}: GetApplyStatusParams): LetsconApplyStatus => {
  if (!hasLiveId) return 'unavailable';
  if (isLoading) return 'loading';
  if (!hasLiveInfo) return 'unavailable';
  // 마감 뒤에도 신청자에게는 서류 제출 링크를 보여야 하므로 마감보다 먼저 본다
  if (applied) return 'applied';
  if (!deadline) return 'unavailable';
  return now.isAfter(deadline) ? 'closed' : 'available';
};
