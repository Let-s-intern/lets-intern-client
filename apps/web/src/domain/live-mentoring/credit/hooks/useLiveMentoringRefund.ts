'use client';

import { useMyLiveMentoringApplicationsQuery } from '@/api/live-mentoring/liveMentoring';
import { useLiveMentoringRefundPreviewQuery } from '@/api/live-mentoring/liveMentoring';
import { readServerError } from '../../utils/serverError';

/**
 * 결제 상세·환불 화면이 함께 쓰는 조회 묶음.
 *
 * 두 곳에서 값을 가져온다.
 * - `refund-preview` — 결제 금액과 예정 환불금액. **서버가 계산한 값이다**
 * - `applications/my` — 상품명·썸네일·예약 일시·진행시간
 *
 * 결제 상세 API(`GET /payment/{paymentId}`)를 쓰지 않는 이유는 라이브 멘토링 신청의
 * `paymentId` 가 Toss 승인 전까지 null 이기 때문이다. `applicationId` 만으로 열리는
 * 화면이라야 결제 직후·승인 지연 상태에서도 무엇을 샀는지 볼 수 있다.
 */
export function useLiveMentoringRefund(applicationId: number | null) {
  const refundPreview = useLiveMentoringRefundPreviewQuery(applicationId);
  const applications = useMyLiveMentoringApplicationsQuery();

  const application =
    applications.data?.applicationList.find(
      (item) => item.applicationId === applicationId,
    ) ?? null;

  return {
    application,
    refundPreview: refundPreview.data ?? null,
    isLoading: refundPreview.isLoading || applications.isLoading,
    /** 조회 자체가 거부된 경우(결제 대기·이미 취소 등)의 서버 문구. */
    error: refundPreview.error ? readServerError(refundPreview.error) : null,
  };
}
