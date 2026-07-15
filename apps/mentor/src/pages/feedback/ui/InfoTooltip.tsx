import { useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { twMerge } from '@/lib/twMerge';
import { feedbackModalDesign } from '@/pages/feedback/feedbackModalDesign';

interface InfoTooltipProps {
  /** 툴팁 본문 텍스트 */
  text: string;
  /** 트리거 aria-label (예: "피드백 참여 안내") */
  label: string;
}

/**
 * 라벨 옆 ⓘ 아이콘 툴팁.
 * hover/focus 모두에서 노출되며, 트리거는 aria-describedby 로 본문과 연결한다.
 *
 * 본문은 document.body 에 portal 렌더하고 `position: absolute` + 페이지 좌표
 * (rect + window.scroll*)로 배치한다. 모달 내부의 `overflow-*` 컨테이너에 잘리지 않으면서,
 * 툴팁이 열린 채 스크롤해도 트리거와 어긋나지 않는다.
 */
const InfoTooltip = ({ text, label }: InfoTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipId = useId();

  const show = () => {
    const el = triggerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      // 페이지 기준 절대 좌표(스크롤 오프셋 반영) — 열린 채 스크롤해도 트리거에 붙어있다.
      setPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
    setIsVisible(true);
  };
  const hide = () => setIsVisible(false);

  return (
    <span className="inline-flex items-center">
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-describedby={isVisible ? tooltipId : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
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
      {createPortal(
        <span
          id={tooltipId}
          role="tooltip"
          style={{ position: 'absolute', top: pos.top, left: pos.left }}
          className={twMerge(
            feedbackModalDesign.tooltipBox,
            isVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          {/* 말풍선 꼬리 — 위쪽(트리거 방향)을 가리키는 흰 네모 회전 */}
          <span
            aria-hidden
            className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-l border-t border-neutral-200 bg-white"
          />
          {text}
        </span>,
        document.body,
      )}
    </span>
  );
};

export default InfoTooltip;
