import clsx from 'clsx';

import TableBodyCell from './TableBodyCell';
import { challengeUserCellWidthList } from '../../../../../../utils/tableCellWidthList';
import parseInflowPath from '../../../../../../utils/parseInflowPath';
import { IApplication } from '../../../../../../interfaces/interface';

interface Props {
  application: IApplication;
  onClick: (e: any) => void;
}

const TableRowContent = ({ application, onClick }: Props) => {
  const cellWidthList = challengeUserCellWidthList;

  return (
    <div
      className="flex cursor-pointer items-center justify-end border-b border-zinc-300 py-5 pl-3 font-pretendard"
      onClick={onClick}
    >
      <TableBodyCell className={clsx(cellWidthList[0])}>
        {application.name}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[1])}>
        {application.email}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[2])}>
        {application.phoneNum}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[3])}>
        {parseInflowPath(application.inflowPath)}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[4])}>
        {application.university ? application.university : '-'}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[5])}>
        {application.grade === -1 ? '-' : application.grade}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[6])}>
        {application.major ? application.major : '-'}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[7])}>
        데이터 분석가T
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[8])}>
        스타트업T
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[9])}>
        {application.accountType
          ? `${application.accountType} ${application.accountNumber}`
          : '-'}
      </TableBodyCell>
    </div>
  );
};

export default TableRowContent;
