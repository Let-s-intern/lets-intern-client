import clsx from 'clsx';

import { challengeNoticeCellWidthList } from '../../../../../../utils/tableCellWidthList';
import TableBodyCell from './TableBodyCell';

interface Props {
  th: number;
  name: string;
  author: string;
  createdDate: string;
  viewCount: number;
}

const TableBodyRow = ({ th, name, author, createdDate, viewCount }: Props) => {
  const cellWidthList = challengeNoticeCellWidthList;

  return (
    <div className="flex items-center py-2 font-pretendard">
      <TableBodyCell className={clsx(cellWidthList[0])}>{th}</TableBodyCell>
      <TableBodyCell
        className={clsx(cellWidthList[1], 'cursor-pointer underline')}
      >
        {name}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[2])}>{author}</TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[3])}>
        {createdDate}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[4])}>
        {viewCount}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[5])}>
        <div className="flex items-center justify-center gap-4">
          <span className="cursor-pointer font-medium">수정</span>
          <span className="cursor-pointer font-medium">삭제</span>
        </div>
      </TableBodyCell>
    </div>
  );
};

export default TableBodyRow;
