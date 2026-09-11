import { AllInOnePassListItem } from '@/domain/all-in-one-pass/types';

/**
 * A-1 개설 목록 mock 시드. 와이어프레임의 3개 시즌을 반영하되,
 * 모집상태는 실제 오늘 날짜로 파생되므로(util/passStatus) 모집 중/전/마감이
 * 하나씩 나오도록 구매 기간을 배치했다.
 */
export const passFixtures: AllInOnePassListItem[] = [
  {
    id: 1,
    title: '2026 하반기 올인원패스',
    purchaseStartDate: '2026-07-20T00:00:00',
    purchaseEndDate: '2026-09-30T23:59:59', // 모집 중
    passMonths: 3,
    isVisible: true,
    currentApplicantCount: 128,
    maxApplicantCount: null, // ∞
    createdAt: '2026-07-20T14:10:00',
  },
  {
    id: 2,
    title: '2026 겨울 올인원패스',
    purchaseStartDate: '2026-11-01T00:00:00',
    purchaseEndDate: '2026-11-30T23:59:59', // 모집 전
    passMonths: 3,
    isVisible: false,
    currentApplicantCount: 0,
    maxApplicantCount: null,
    createdAt: '2026-09-01T10:00:00',
  },
  {
    id: 3,
    title: '2026 상반기 올인원패스',
    purchaseStartDate: '2026-01-15T00:00:00',
    purchaseEndDate: '2026-02-28T23:59:59', // 모집 마감
    passMonths: 3,
    isVisible: false,
    currentApplicantCount: 95,
    maxApplicantCount: null,
    createdAt: '2026-01-15T09:30:00',
  },
];
