import clsx from 'clsx';

import { missionSubmitCellWidthList } from '../../../../../../utils/tableCellWidthList';
import TableHeadBox from '../../../ui/table/table-head/TableHeadBox';
import TableHeadCell from '../../../ui/table/table-head/TableHeadCell';

const TableHead = () => {
  const cellWidthList = missionSubmitCellWidthList;

  return (
    <TableHeadBox>
      <TableHeadCell className={clsx(cellWidthList[0])}>회차</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[1])}>미션명</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[2])}>공개일</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[3])}>마감일</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[4])}>
        연결콘텐츠
      </TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[5])}>제출현황</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[6])}>상태</TableHeadCell>
    </TableHeadBox>
  );
};

export default TableHead;
