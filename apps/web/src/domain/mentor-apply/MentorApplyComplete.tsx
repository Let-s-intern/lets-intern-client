import Link from 'next/link';

const buttonClassName =
  'text-xsmall16 rounded-sm px-6 py-3 text-center font-semibold transition-colors';
const secondaryButtonClassName = `${buttonClassName} border-neutral-80 text-neutral-10 hover:bg-neutral-95 border`;

interface MentorApplyCompleteProps {
  /** 모달에서는 `홈으로` 가 모달 닫기다. 없으면 `/` 로 이동한다 */
  onHome?: () => void;
}

/** 제출 완료 화면. 텍스트는 시안 그대로다 */
export default function MentorApplyComplete({
  onHome,
}: MentorApplyCompleteProps) {
  return (
    <div className="flex flex-col items-center break-keep py-16 text-center">
      <div className="bg-primary-10 text-primary flex h-14 w-14 items-center justify-center rounded-full">
        <svg
          aria-hidden
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>
      <h1 className="text-medium24 text-neutral-0 mt-6 font-bold">
        신청서가 제출되었습니다
      </h1>
      <p className="text-xsmall16 text-neutral-30 mt-3 leading-relaxed">
        귀한 시간 내주시어 감사합니다.
        <br />
        5영업일 내로 선택해주신 연락 수단을 통해 회신드리겠습니다.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/mentor-apply/status"
          className={`${buttonClassName} bg-primary text-static-100 hover:bg-primary-hover`}
        >
          신청 현황 조회
        </Link>
        {onHome ? (
          <button
            type="button"
            onClick={onHome}
            className={secondaryButtonClassName}
          >
            홈으로
          </button>
        ) : (
          <Link href="/" className={secondaryButtonClassName}>
            홈으로
          </Link>
        )}
      </div>
    </div>
  );
}
