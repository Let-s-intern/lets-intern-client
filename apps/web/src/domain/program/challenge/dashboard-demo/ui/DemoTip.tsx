import { useEffect, useRef } from 'react';

interface Props {
  text: string;
  step: number;
  total: number;
  onNext: () => void;
}

/**
 * 대시보드 기능 위에 하나씩 띄우는 안내 말풍선. 대상 요소 안에 두고 그 위쪽에 붙는다.
 * 모양은 공지사항 카드의 "새로운 공지를 확인해주세요!" 말풍선을 따랐다.
 */
const DemoTip = ({ text, step, total, onNext }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const isLast = step + 1 === total;

  // 말풍선이 보이도록 체험 창 안에서만 스크롤한다. scrollIntoView 는 상세 페이지까지 움직인다.
  useEffect(() => {
    const tip = ref.current;
    const container = tip?.closest('[data-demo-scroll]');
    if (!tip || !container) return;

    const top =
      tip.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop;
    container.scrollTo({ top: Math.max(top - 16, 0), behavior: 'smooth' });
  }, []);

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-4 z-[5] mb-2.5 w-[240px] rounded-xxs bg-primary-90 px-3 py-2.5 text-static-100 shadow-03 after:absolute after:left-5 after:top-full after:border-x-[6px] after:border-t-[8px] after:border-x-transparent after:border-t-primary-90 after:content-['']"
    >
      <p className="whitespace-pre-line text-xsmall14">{text}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xxsmall12 opacity-80">
          {step + 1}/{total}
        </span>
        <button
          type="button"
          onClick={onNext}
          className="rounded-xxs bg-static-100 px-2.5 py-1 text-xxsmall12 font-semibold text-primary-90"
        >
          {isLast ? '알겠어요' : '다음'}
        </button>
      </div>
    </div>
  );
};

export default DemoTip;
