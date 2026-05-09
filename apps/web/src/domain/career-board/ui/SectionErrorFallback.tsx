export const SectionErrorFallback = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-8">
    <p className="text-xsmall14 text-neutral-40">불러오지 못했어요.</p>
    <button
      type="button"
      onClick={onRetry}
      className="rounded-xs border-neutral-80 text-xsmall14 text-neutral-20 border px-4 py-2 font-medium"
    >
      다시 시도
    </button>
  </div>
);
