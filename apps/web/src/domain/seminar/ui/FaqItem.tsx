import { useId } from 'react';
import type { SeminarFaq } from '../data/faqs';

/**
 * S10 FAQ 항목 — 세미나 도메인 자체 아코디언 항목(하드코딩).
 * 열림 상태는 부모(FaqSection)가 단일 제어하며, 아이콘 회전으로 표현한다.
 *
 * [이력] 이전엔 공용 헤드리스 Accordion(@letscareer/ui · packages/ui/src/Accordion)의
 * AccordionItem/AccordionTrigger/AccordionContent 를 소비했다. 헤드리스 Accordion의
 * 호출처는 FaqSection.tsx 와 이 파일 두 곳이 전부였고, 프리미티브 제거 후 로컬 구현으로 대체했다.
 */
const FaqItem = ({
  faq,
  isOpen,
  onToggle,
}: {
  faq: SeminarFaq;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const reactId = useId();
  const triggerId = `faq-trigger-${reactId}`;
  const contentId = `faq-content-${reactId}`;
  const state = isOpen ? 'open' : 'closed';

  return (
    <div
      data-state={state}
      className="overflow-hidden rounded-md border border-neutral-85"
    >
      <button
        type="button"
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={contentId}
        data-state={state}
        onClick={onToggle}
        className="group flex w-full items-center justify-between gap-4 bg-neutral-95 px-5 py-4 text-left text-xsmall16 font-bold text-neutral-0 data-[state=open]:bg-neutral-100 md:text-small18"
      >
        <span className="break-keep">{faq.question}</span>
        <svg
          className="shrink-0 text-neutral-40 transition-transform group-data-[state=open]:rotate-180"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
        >
          <path
            d="M5 7.5 10 12.5 15 7.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!isOpen}
        data-state={state}
        className="whitespace-pre-line px-5 py-4 text-xsmall14 leading-relaxed text-neutral-30 md:text-xsmall16"
      >
        {faq.answer}
      </div>
    </div>
  );
};

export default FaqItem;
