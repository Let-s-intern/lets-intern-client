import clsx from 'clsx';

const reviewColumnWidth = {
  createdDate: 'w-32',
  category: 'w-30',
  title: 'flex-1',
  score: 'w-40',
  content: 'w-40',
};

export default function BlogRatingTable() {
  return (
    <div className="mt-3 min-w-[60rem]">
      {/* TableHeader */}
      <div className="flex rounded-sm bg-[#E5E5E5]">
        <TableHeaderCell widthClassName={reviewColumnWidth.createdDate}>
          등록일자
        </TableHeaderCell>
        <TableHeaderCell widthClassName={reviewColumnWidth.category}>
          카테고리
        </TableHeaderCell>
        <TableHeaderCell widthClassName={reviewColumnWidth.title}>
          제목
        </TableHeaderCell>
        <TableHeaderCell widthClassName={reviewColumnWidth.score}>
          만족도
        </TableHeaderCell>
        <TableHeaderCell widthClassName={reviewColumnWidth.content}>
          후기 답변
        </TableHeaderCell>
      </div>

      {/* TableBody */}
      <div className="mb-16 mt-3 flex flex-col gap-2"></div>
    </div>
  );
}

interface TableHeaderCellProps {
  widthClassName: string;
  children: React.ReactNode;
}

function TableHeaderCell({ widthClassName, children }: TableHeaderCellProps) {
  return (
    <div
      className={clsx(
        'flex justify-center py-2 text-sm font-medium text-[#717179]',
        widthClassName,
      )}
    >
      {children}
    </div>
  );
}

interface TableBodyCellProps {
  widthClassName: string;
  children: React.ReactNode;
}

function TableBodyCell({ widthClassName, children }: TableBodyCellProps) {
  return (
    <div
      className={clsx(
        'flex items-center justify-center py-4 text-center text-sm text-zinc-600',
        widthClassName,
      )}
    >
      {children}
    </div>
  );
}
