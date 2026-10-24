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
): CtaState {
  const isApplied = applicationForm?.applied ?? false;
  const now = dayjs();
  const beginning = applicationForm?.beginning
    ? dayjs(applicationForm.beginning)
    : null;
  const deadline = applicationForm?.deadline
    ? dayjs(applicationForm.deadline)
    : null;
  const isBeforeSale = !!beginning && now.isBefore(beginning);
  const isClosed = !!deadline && now.isAfter(deadline);

  const ctaDisabled = isApplied || isBeforeSale || isClosed;
  const ctaText = isApplied
    ? '이미 신청이 완료되었습니다.'
    : isBeforeSale
      ? '판매 예정입니다.'
      : isClosed
        ? '판매가 종료되었습니다.'
        : '지금 바로 시작하기';

  // 하단 바 버튼은 모바일에서 길어지면 안 돼 짧은 라벨로 분기.
  const barCtaText = isApplied
    ? '신청 완료'
    : isClosed
      ? '신청 마감'
      : '지금 바로 시작';

  return { ctaText, barCtaText, ctaDisabled };
}
