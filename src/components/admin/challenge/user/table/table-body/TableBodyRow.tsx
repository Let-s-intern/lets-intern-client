import clsx from 'clsx';

import { missionUserCellWidthList } from '../../../../../../utils/tableCellWidthList';
import TableBodyCell from './TableBodyCell';

interface Props {
  name: string;
  isMember: boolean;
  school: string;
  email: string;
  tel: string;
  inflowPath: string;
  account: string;
}

const TableBodyRow = ({
  name,
  isMember,
  school,
  email,
  tel,
  inflowPath,
  account,
}: Props) => {
  const cellWidthList = missionUserCellWidthList;

  return (
    <div className="flex cursor-pointer items-center border-b border-zinc-300 py-5 pl-3">
      <TableBodyCell className={clsx(cellWidthList[0])}>
        <i>
          <img src="/icons/admin-checkbox-unchecked.svg" alt="checkbox-icon" />
        </i>
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[1])}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{name}</span>
          <span className="block rounded border border-black px-1 py-[1px] text-xs">
            {isMember ? '회원' : '비회원'}
          </span>
        </div>
        <div className="text-xs font-light">{school}</div>
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[2])}>{email}</TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[3])}>{tel}</TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[4])}>
        {inflowPath}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[5])}>
        {account}
      </TableBodyCell>
    </div>
  );
};

export default TableBodyRow;
