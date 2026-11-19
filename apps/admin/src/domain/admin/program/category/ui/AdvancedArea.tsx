import type { ReactNode } from 'react';

/** 평소에 쓸 일이 적은 설정. 접힌 채로 시작한다 */
const AdvancedArea = ({
  summary = '고급 설정',
  children,
}: {
  summary?: string;
  children: ReactNode;
}) => (
  <details className="group rounded-xs border border-neutral-80 bg-white">
    <summary className="cursor-pointer select-none px-3 py-2 text-xsmall14 font-semibold text-neutral-30">
      {summary}
    </summary>
    <div className="flex flex-col gap-2 border-t border-neutral-80 p-3">
      {children}
    </div>
  </details>
);

export default AdvancedArea;
