import { useState, type ReactNode } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

/** 요약 한 줄. 누르면 아래에 자세한 내용이 펼쳐진다. 처음에는 접혀 있다 */
const ExpandableLine = ({
  summary,
  aside,
  children,
}: {
  summary: ReactNode;
  /** 줄 오른쪽. 링크처럼 펼치기와 따로 눌리는 것 */
  aside?: ReactNode;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <div className="flex items-center gap-2 py-2">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <span className="shrink-0 text-neutral-50">
            {open ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
          </span>
          <span className="min-w-0 flex-1">{summary}</span>
        </button>
        {aside}
      </div>
      {open && <div className="pb-3 pl-5">{children}</div>}
    </li>
  );
};

export default ExpandableLine;
