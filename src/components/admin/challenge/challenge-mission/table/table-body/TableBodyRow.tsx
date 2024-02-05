import { missionCellWidthList } from '../../../../../../utils/tableCellWidthList';
import TableBodyCell from './TableBodyCell';

interface Props {
  th: number;
  name: string;
  startDate: string;
  endDate: string;
  isRefunded: boolean;
  connectedContents: string;
  submitCount: number;
  totalCount: number;
  isVisible: boolean;
}

const TableBodyRow = ({
  th,
  name,
  startDate,
  endDate,
  isRefunded,
  connectedContents,
  submitCount,
  totalCount,
  isVisible,
}: Props) => {
  const cellWidthList = missionCellWidthList;

  return (
    <div className="flex cursor-pointer rounded-md border border-neutral-200 font-pretendard">
      <TableBodyCell className={`${cellWidthList[0]}`} bold>
        {th}
      </TableBodyCell>
      <TableBodyCell
        className={`${cellWidthList[1]} text-base text-zinc-600`}
        bold
      >
        {name}
      </TableBodyCell>
      <TableBodyCell className={`${cellWidthList[2]}`}>
        {startDate}
      </TableBodyCell>
      <TableBodyCell className={`${cellWidthList[3]}`}>{endDate}</TableBodyCell>
      <TableBodyCell className={`${cellWidthList[4]}`}>
        {isRefunded ? 'O' : 'X'}
      </TableBodyCell>
      <TableBodyCell className={`${cellWidthList[5]}`}>
        {connectedContents}
      </TableBodyCell>
      <TableBodyCell className={`${cellWidthList[6]}`}>
        {submitCount}/{totalCount}
      </TableBodyCell>
      <TableBodyCell className={`${cellWidthList[7]}`}>
        {isVisible ? '노출' : '비노출'}
      </TableBodyCell>
      <TableBodyCell className={`${cellWidthList[8]}`}>
        <img src="/icons/edit-icon.svg" alt="edit-icon" />
      </TableBodyCell>
    </div>
  );
};

export default TableBodyRow;
