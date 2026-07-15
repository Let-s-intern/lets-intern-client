'use client';

/** 좌측 분할 패널 아이콘 */
const SidePanelIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect
      x="2"
      y="3"
      width="12"
      height="10"
      rx="1.5"
      stroke="#4D55F5"
      strokeWidth="1.2"
    />
    <path d="M6.5 3V13" stroke="#4D55F5" strokeWidth="1.2" />
  </svg>
);

interface SideViewButtonProps {
  onClick?: () => void;
  size?: number;
  className?: string;
}

/**
 * 제출물(경험·노션)을 모달 왼쪽 패널로 띄우는 토글 버튼 (보면서 타이핑용).
 * 서면(MenteeInfo)·라이브(LiveFeedbackReservationModal) 양쪽에서 공유한다.
 * 클릭 시 패널 열림/닫힘이 토글된다(핸들러는 호출처에서 토글로 구현).
 */
const SideViewButton = ({
  onClick,
  size = 16,
  className = '',
}: SideViewButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    title="옆에 두고 보기"
    aria-label="제출물을 옆에 두고 보기"
    className={`inline-flex shrink-0 items-center justify-center rounded border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 ${className}`}
  >
    <SidePanelIcon size={size} />
  </button>
);

export default SideViewButton;
