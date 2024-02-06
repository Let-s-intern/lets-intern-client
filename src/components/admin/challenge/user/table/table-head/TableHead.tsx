import clsx from 'clsx';

import { challengeUserCellWidthList } from '../../../../../../utils/tableCellWidthList';
import TableHeadCell from './TableHeadCell';

const TableHead = () => {
  const cellWidthList = challengeUserCellWidthList;

  return (
    <div className="flex border-b border-zinc-300 py-4 pl-3 text-sm font-medium text-zinc-500">
      <TableHeadCell className={clsx(cellWidthList[0])} />
      <TableHeadCell className={clsx(cellWidthList[1])}>
        이름/기본정보
      </TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[2])}>이메일</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[3])}>번호</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[4])}>유입경로</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[5])}>계좌</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[6])} />
    </div>
  );
};

export default TableHead;
