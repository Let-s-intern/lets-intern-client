import clsx from 'clsx';

import { challengeUserCellWidthList } from '../../../../../../utils/tableCellWidthList';
import TableHeadCell from './TableHeadCell';

const TableHead = () => {
  const cellWidthList = challengeUserCellWidthList;

  return (
    <div className="flex justify-end border-b border-zinc-300 py-4 pl-3 text-sm font-medium text-zinc-500">
      <TableHeadCell className={clsx(cellWidthList[0])}>이름</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[1])}>이메일</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[2])}>전화번호</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[3])}>유입경로</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[4])}>학교</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[5])}>학년</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[6])}>전공</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[7])}>희망직무</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[8])}>희망가입</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[9])}>환급계좌</TableHeadCell>
    </div>
  );
};

export default TableHead;
