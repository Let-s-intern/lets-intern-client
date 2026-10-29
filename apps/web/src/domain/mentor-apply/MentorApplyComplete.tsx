import Link from 'next/link';

import { primaryButtonClassName, secondaryButtonClassName } from './ui/styles';

const buttonClassName = 'px-6 py-3 text-center';

interface MentorApplyCompleteProps {
  /** 모달에서는 `홈으로` 가 모달 닫기다. 없으면 멘토 모집 랜딩으로 이동한다 */
  onHome?: () => void;
}

/** 제출 완료 화면. 텍스트는 시안 그대로다 */
export default function MentorApplyComplete({
  onHome,
}: MentorApplyCompleteProps) {
  return (
    <div className="flex flex-col items-center break-keep py-20 text-center text-zinc-900">
      <div className="flex size-14 items-center justify-center rounded-full bg-[#eef0ff] text-[#4d55f5]">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          className="size-7"
        >
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">
        신청서가 제출되었습니다
      </h1>
      <p className="mt-3 leading-relaxed text-zinc-600">
        귀한 시간 내주시어 감사합니다.
        <br />
        5영업일 내로 선택해주신 연락 수단을 통해 회신드리겠습니다.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/mentor-apply/status"
          className={`${primaryButtonClassName} ${buttonClassName}`}
        >
          신청 현황 조회
        </Link>
        {onHome ? (
          <button
            type="button"
            onClick={onHome}
            className={`${secondaryButtonClassName} ${buttonClassName}`}
          >
            홈으로
          </button>
        ) : (
          <Link
            href="/mentor-join"
            className={`${secondaryButtonClassName} ${buttonClassName}`}
          >
            홈으로
          </Link>
        )}
      </div>
    </div>
  );
}
