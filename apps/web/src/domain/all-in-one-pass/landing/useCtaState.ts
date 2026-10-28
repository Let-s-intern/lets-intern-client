// 신청여부·판매기간으로 CTA 문구/비활성 상태 파생.
import type { MembershipApplicationForm } from '@/domain/all-in-one-pass/api/purchase';
import dayjs from '@/lib/dayjs';

interface CtaState {
  ctaText: string;
  barCtaText: string;
  ctaDisabled: boolean;
}

export function useCtaState(
  applicationForm: MembershipApplicationForm | undefined,
  // 노출용 모집 종료일. 있으면 마감 판정을 실제 deadline 대신 이 값으로.
  displayDeadline?: string | null,
): CtaState {
  const isApplied = applicationForm?.applied ?? false;
  // 다른 패스로 이미 유효 멤버십을 보유 중이면 중복 구매 차단(BE hasActiveMembership).
  const hasActiveMembership = applicationForm?.hasActiveMembership ?? false;
  const now = dayjs();
  const beginning = applicationForm?.beginning
    ? dayjs(applicationForm.beginning)
    : null;
  const effectiveDeadline = displayDeadline ?? applicationForm?.deadline;
  const deadline = effectiveDeadline ? dayjs(effectiveDeadline) : null;
  const isBeforeSale = !!beginning && now.isBefore(beginning);
  const isClosed = !!deadline && now.isAfter(deadline);

  const ctaDisabled =
    isApplied || hasActiveMembership || isBeforeSale || isClosed;
  const ctaText = isApplied
    ? '신청이 완료되었습니다.'
    : isClosed
      ? '판매가 종료되었습니다.'
      : hasActiveMembership
        ? '이용 중인 패스가 있어요'
        : isBeforeSale
          ? '판매 예정입니다.'
          : '지금 바로 시작하기';

  // 하단 바 버튼은 모바일에서 길어지면 안 돼 짧은 라벨로 분기.
  const barCtaText = isApplied
    ? '신청 완료'
    : isClosed
      ? '신청 마감'
      : hasActiveMembership
        ? '지금 바로 시작'
        : '지금 바로 시작';

  return { ctaText, barCtaText, ctaDisabled };
}
