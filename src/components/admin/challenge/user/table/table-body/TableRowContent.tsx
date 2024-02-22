import clsx from 'clsx';
import { IoMdArrowDropdown } from 'react-icons/io';

import TableBodyCell from './TableBodyCell';
import { challengeUserCellWidthList } from '../../../../../../utils/tableCellWidthList';
import parseInflowPath from '../../../../../../utils/parseInflowPath';

interface Props {
  application: any;
  onClick: (e: any) => void;
}

const TableRowContent = ({ application, onClick }: Props) => {
  const cellWidthList = challengeUserCellWidthList;

  return (
    <div
      className="flex cursor-pointer items-center border-b border-zinc-300 py-5 pl-3 font-pretendard"
      onClick={onClick}
    >
      <TableBodyCell className={clsx(cellWidthList[0])}>
        <i>
          <img src="/icons/admin-checkbox-unchecked.svg" alt="checkbox-icon" />
        </i>
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[1])}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{application.name}</span>
          <span className="block rounded border border-black px-1 py-[1px] text-xs">
            {application.type === 'USER' ? '회원' : '비회원'}
          </span>
        </div>
        <div className="text-xs font-light">{application.university}</div>
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[2])}>
        {application.email}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[3])}>
        {application.phoneNum}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[4])}>
        {parseInflowPath(application.inflowPath)}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[5])}>
        {application.accountType} {application.accountNumber}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[6])}>
        <i className="text-xl">
          <IoMdArrowDropdown />
        </i>
      </TableBodyCell>
    </div>
  );
};

export default TableRowContent;
