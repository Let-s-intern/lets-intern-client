/**
 * 이용 히스토리 목록 페이지 이동 (LC-3201).
 *
 * 환불 히스토리 화면에도 같은 모양이 있지만 그쪽 파일 안의 로컬 컴포넌트라 가져다 쓰지 않는다.
 * 한 쪽을 고치면 다른 쪽이 따라 바뀌는 결합을 만들지 않는다.
 */
interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const UsagePagination = ({ page, totalPages, onChange }: Props) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-center gap-2 text-sm">
      <button
        type="button"
        className="rounded border border-neutral-300 px-3 py-1 disabled:text-neutral-300"
        onClick={() => onChange(Math.max(0, page - 1))}
        disabled={page === 0}
      >
        이전
      </button>
      <span>
        {page + 1} / {totalPages}
      </span>
      <button
        type="button"
        className="rounded border border-neutral-300 px-3 py-1 disabled:text-neutral-300"
        onClick={() => onChange(Math.min(totalPages - 1, page + 1))}
        disabled={page >= totalPages - 1}
      >
        다음
      </button>
    </div>
  );
};

export default UsagePagination;
