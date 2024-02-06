import clsx from 'clsx';

import { missionCellWidthList } from '../../../../../../../utils/tableCellWidthList';
import TableBodyCell from '../../../../ui/table/table-body/TableBodyCell';
import TableBodyRowBox from '../../../../ui/table/table-body/TableBodyRowBox';

interface Props {
  th: number;
  name: string;
  releaseDate: string;
  dueDate: string;
  isRefunded: boolean;
  connectedContents: string;
  submitCount: number;
  totalCount: number;
  isVisible: boolean;
}

const TableBodyRow = ({
  th,
  name,
  releaseDate,
  dueDate,
  isRefunded,
  connectedContents,
  submitCount,
  totalCount,
  isVisible,
}: Props) => {
  const cellWidthList = missionCellWidthList;

  return (
    <TableBodyRowBox>
      <TableBodyCell className={clsx(cellWidthList[0])}>{th}</TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[1])} bold>
        {name}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[2])}>
        {releaseDate}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[3])}>
        {dueDate}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[4])}>
        {isRefunded ? 'O' : 'X'}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[5])}>
        {connectedContents}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[6])}>
        {submitCount}/{totalCount}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[7])}>
        {isVisible ? '노출' : '비노출'}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[8])}>
        <i>
          <img src="/icons/edit-icon.svg" alt="edit-icon" />
        </i>
      </TableBodyCell>
    </TableBodyRowBox>
  );
};

export default TableBodyRow;
