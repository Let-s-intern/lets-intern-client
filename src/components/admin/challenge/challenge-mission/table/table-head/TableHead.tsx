import clsx from 'clsx';

import { missionCellWidthList } from '../../../../../../utils/tableCellWidthList';
import TableHeadCell from './TableHeadCell';

interface Props {
  className?: string;
}

const TableHead = ({ className }: Props) => {
  const cellWidthList = missionCellWidthList;

  return (
    <div className={clsx('flex w-full rounded-md bg-neutral-200', className)}>
      <TableHeadCell className={`${cellWidthList[0]}`}>번호</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[1]}`}>미션명</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[2]}`}>공개일</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[3]}`}>마감일</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[4]}`}>환급여부</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[5]}`}>
        연결콘텐츠
      </TableHeadCell>
      <TableHeadCell className={`${cellWidthList[6]}`}>제출현황</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[7]}`}>노출</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[8]}`} />
    </div>
  );
};

export default TableHead;
