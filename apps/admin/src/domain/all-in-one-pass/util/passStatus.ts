import dayjs from '@/lib/dayjs';
import { AllInOnePassListItem, PassRecruitmentStatus } from '../types';

/**
 * 모집상태는 저장하지 않고 구매 가능 기간으로 파생한다.
 * - now < 시작일        → 모집 전(BEFORE)
 * - 시작일 ≤ now ≤ 종료일 → 모집 중(PROCEEDING)
 * - now > 종료일        → 모집 마감(CLOSED)
 * 시작일이 없으면 이미 시작한 것으로, 종료일이 없으면 마감되지 않는 것으로 본다.
 */
export const getPassRecruitmentStatus = (
  pass: Pick<AllInOnePassListItem, 'purchaseStartDate' | 'purchaseEndDate'>,
): PassRecruitmentStatus => {
  const now = dayjs();
  if (pass.purchaseStartDate && now.isBefore(pass.purchaseStartDate)) {
    return 'BEFORE';
  }
  if (pass.purchaseEndDate && now.isAfter(pass.purchaseEndDate)) {
    return 'CLOSED';
  }
  return 'PROCEEDING';
};

export const passRecruitmentStatusToText: Record<
  PassRecruitmentStatus,
  string
> = {
  BEFORE: '모집 전',
  PROCEEDING: '모집 중',
  CLOSED: '모집 마감',
};
