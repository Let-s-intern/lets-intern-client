import { useId, useState } from 'react';

interface InfoTooltipProps {
  /** 툴팁 본문 텍스트 */
  text: string;
  /** 트리거 aria-label (예: "피드백 참여 안내") */
  label: string;
}

/**
 * 라벨 옆 ⓘ 아이콘 툴팁.
 * hover/focus 모두에서 노출되며, 트리거는 aria-describedby 로 본문과 연결한다.
 */
const InfoTooltip = ({ text, label }: InfoTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-label={label}
        aria-describedby={tooltipId}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="text-neutral-400 transition-colors hover:text-neutral-600"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle
            cx="8"
            cy="8"
            r="6.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M8 7.2V11M8 5.2V5.6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <span
        id={tooltipId}
        role="tooltip"
        className={`absolute left-1/2 top-full z-10 mt-1.5 w-56 -translate-x-1/2 rounded-lg bg-neutral-800 px-3 py-2 text-xs leading-5 text-white shadow-lg transition-opacity ${
          isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {text}
      </span>
    </span>
  );
};

export default InfoTooltip;
