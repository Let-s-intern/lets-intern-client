import clsx from 'clsx';

import { missionContentsCellWidthList } from '../../../../../../../utils/tableCellWidthList';
import TableHeadBox from '../../../../ui/table/table-head/TableHeadBox';
import TableHeadCell from '../../../../ui/table/table-head/TableHeadCell';

const TableHead = () => {
  const cellWidthList = missionContentsCellWidthList;

  return (
    <TableHeadBox>
      <TableHeadCell className={clsx(cellWidthList[0])}>구분</TableHeadCell>
      <div
        className={clsx(
          cellWidthList[1],
          'flex-1 py-2 text-left text-sm font-medium text-zinc-500',
        )}
      >
        <span className="ml-16">콘텐츠</span>
      </div>
      <TableHeadCell className={clsx(cellWidthList[2])} />
    </TableHeadBox>
  );
};

export default TableHead;
