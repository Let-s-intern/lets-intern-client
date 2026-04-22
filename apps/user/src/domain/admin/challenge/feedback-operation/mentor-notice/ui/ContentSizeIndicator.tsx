import { DB_LIMIT } from '../types';

interface ContentSizeIndicatorProps {
  content: string;
}

/** 에디터 내용의 DB 용량 사용량을 시각적으로 표시 */
export function ContentSizeIndicator({ content }: ContentSizeIndicatorProps) {
  const bytes = new TextEncoder().encode(content).length;
  const kb = (bytes / 1024).toFixed(1);
  const percent = Math.min((bytes / DB_LIMIT) * 100, 100);
  const isOver = bytes > DB_LIMIT;
  const isWarning = percent > 80;

  const barColor = isOver
    ? 'bg-red-500'
    : isWarning
      ? 'bg-amber-400'
      : 'bg-primary';

  return (
    <div className="mt-2 flex flex-col gap-1">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-90">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div
        className={`text-right text-xs ${isOver ? 'font-medium text-red-500' : 'text-neutral-40'}`}
      >
        {kb} KB / {(DB_LIMIT / 1024).toFixed(0)} KB ({percent.toFixed(1)}%)
        {isOver && ' — 용량 초과!'}
      </div>
    </div>
  );
}
