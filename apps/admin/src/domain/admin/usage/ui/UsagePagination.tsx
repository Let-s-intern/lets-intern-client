/**
 * 이용 히스토리 목록 페이지 이동 (LC-3201).
 *
 * 환불 히스토리 화면에도 같은 모양이 있지만 그쪽 파일 안의 로컬 컴포넌트라 가져다 쓰지 않는다.
 * 한 쪽을 고치면 다른 쪽이 따라 바뀌는 결합을 만들지 않는다.
 */
interface Props {
  /** 1 부터 센다. 서버가 1-indexed 라 상태도 같은 규칙으로 둔다. */
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const FIRST_PAGE = 1;

const UsagePagination = ({ page, totalPages, onChange }: Props) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-center gap-2 text-sm">
      <button
        type="button"
        className="rounded border border-neutral-300 px-3 py-1 disabled:text-neutral-300"
        onClick={() => onChange(Math.max(FIRST_PAGE, page - 1))}
        disabled={page <= FIRST_PAGE}
      >
        이전
      </button>
      {/* 표시에 보정이 없다. 상태와 서버가 같은 기준이면 변환할 것이 남지 않는다. */}
      <span>
        {page} / {totalPages}
      </span>
      <button
        type="button"
        className="rounded border border-neutral-300 px-3 py-1 disabled:text-neutral-300"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        다음
      </button>
    </div>
  );
};

export default UsagePagination;
