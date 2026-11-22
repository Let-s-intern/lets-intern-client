import clsx from 'clsx';
import { useEffect, useRef } from 'react';

export type DemoTipPlacement = 'top' | 'bottom';

interface Props {
  text: string;
  step: number;
  total: number;
  onNext: () => void;
  /** 대상 요소의 위(top) 또는 아래(bottom)에 붙인다. 체험 창 맨 위 요소는 아래로 붙인다 */
  placement?: DemoTipPlacement;
  /** true 면 말풍선이 나타날 때 화면을 말풍선 쪽으로 부드럽게 옮긴다 */
  scroll?: boolean;
}

const PLACEMENT_CLASS: Record<DemoTipPlacement, string> = {
  top: 'bottom-full mb-2.5 after:left-5 after:top-full after:border-x-[6px] after:border-t-[8px] after:border-x-transparent after:border-t-primary-90',
  bottom:
    'top-full mt-2.5 after:bottom-full after:left-5 after:border-x-[6px] after:border-b-[8px] after:border-x-transparent after:border-b-primary-90',
};

/**
 * 대시보드 기능 옆에 하나씩 띄우는 안내 말풍선. 대상 요소 안에 두고 그 위나 아래에 붙는다.
 * 모양은 공지사항 카드의 "새로운 공지를 확인해주세요!" 말풍선을 따랐다.
 */
const DemoTip = ({
  text,
  step,
  total,
  onNext,
  placement = 'top',
  scroll = false,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const isLast = step + 1 === total;

  // 체험 창은 스크롤이 없어 페이지가 길어진다. 다음 안내를 누르면 그 말풍선이 보이게 페이지를 옮긴다.
  useEffect(() => {
    if (!scroll) return;
    ref.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [scroll]);

  return (
    <div
      ref={ref}
      className={clsx(
        "absolute left-4 z-[5] w-[220px] rounded-xxs bg-primary-90 px-3 py-2.5 text-static-100 shadow-03 after:absolute after:content-['']",
        PLACEMENT_CLASS[placement],
      )}
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
