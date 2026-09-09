import { twMerge } from '@/lib/twMerge';

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: '대기',
    className: ' border-yellow-700 bg-yellow-100 text-yellow-700',
  },
  APPROVED: {
    label: '승인',
    className: 'border-green-700 bg-green-100 text-green-700',
  },
  REJECTED: {
    label: '반려',
    className: 'border-red-600 bg-red-100 text-red-600',
  },
};

/** 합격 인증 상태 뱃지 (그리드·상세 모달 공용) */
export default function PassStatusBadge({ status }: { status: string }) {
  const badge = STATUS_BADGE[status] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-600',
  };
  return (
    <span
      className={twMerge(
        'text-xxsmall12 rounded-full border px-2.5 py-1 font-semibold',
        badge.className,
      )}
    >
      {badge.label}
    </span>
  );
}
