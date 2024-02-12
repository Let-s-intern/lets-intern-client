import clsx from 'clsx';

import { challengeNoticeCellWidthList } from '../../../../../../utils/tableCellWidthList';
import TableHeadCell from './TableHeadCell';

const TableHead = () => {
  const cellWidthList = challengeNoticeCellWidthList;

  return (
    <div className="flex border-b border-t-2 border-b-zinc-200 border-t-stone-500 py-2 font-medium">
      <TableHeadCell className={clsx(cellWidthList[0])}>번호</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[1])}>유형</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[2])}>제목</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[3])}>작성일</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[4])}>관리</TableHeadCell>
    </div>
  );
};

export default TableHead;
