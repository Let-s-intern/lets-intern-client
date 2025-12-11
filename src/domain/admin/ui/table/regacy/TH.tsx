import clsx from 'clsx';
import { FaCheck } from 'react-icons/fa6';

export interface THProps {
  onClick?: () => void;
  children: React.ReactNode;
  inOrder?: 'ASCENDING' | 'DESCENDING' | null;
  inBoolFilter?: boolean | null;
  colspan?: number;
  backgroundColor?: string;
}

const TH = ({
  onClick,
  inOrder,
  inBoolFilter,
  children,
  colspan,
  backgroundColor,
}: THProps) => {
  return (
    <th
      className={clsx(
        'whitespace-nowrap border border-white bg-neutral-200 px-4 py-2 text-xs font-medium',
        onClick && 'cursor-pointer',
      )}
      onClick={onClick}
      colSpan={colspan}
      style={{ backgroundColor }}
    >
      <span className="flex items-center justify-center gap-1">
        <span>{children}</span>
        {inOrder !== undefined &&
          (inOrder === null ? (
            <span>△▽</span>
          ) : (
            <span>
              {inOrder === 'ASCENDING' ? '▲' : inOrder === 'DESCENDING' && '▼'}
            </span>
          ))}
        {inBoolFilter !== undefined &&
          (inBoolFilter === null ? (
            <span className="flex items-center gap-0.5">
              <FaCheck />
              <span>□</span>
            </span>
          ) : (
            <span>{inBoolFilter ? <FaCheck /> : '□'}</span>
          ))}
      </span>
    </th>
  );
};

export default TH;
