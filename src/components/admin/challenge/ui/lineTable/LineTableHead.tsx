import clsx from 'clsx';

import TableHeadCell from '../table/table-head/TableHeadCell';

interface LineTableHeadProps {
  colNames: string[];
  cellWidthList: string[];
}

/**
 * 테이블 헤더 컴포넌트
 * @param colNames - 테이블 헤더에 표시할 컬럼 이름 (배열 순서대로 컬럼에 표시)
 * @param cellWidthList - 테이블 헤더 셀의 너비 리스트 (column과 순서 일치해야 함)
 */
const LineTableHead = ({ colNames, cellWidthList }: LineTableHeadProps) => {
  return (
    <div className={clsx('flex w-full rounded-sm bg-neutral-200')}>
      {colNames.map((name, i) => (
        <TableHeadCell key={name} className={clsx(cellWidthList[i])}>
          {name}
        </TableHeadCell>
      ))}
      <TableHeadCell className="flex-1">관리</TableHeadCell>
    </div>
  );
};

export default LineTableHead;
