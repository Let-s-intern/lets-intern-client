import { missionCellWidthList } from '../../../../../../../utils/tableCellWidthList';
import TableBodyCell from '../../../ui/table/table-body/TableBodyCell';
import TableBodyRowBox from '../../../ui/table/table-body/TableBodyRowBox';

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
      <TableBodyCell className={`${cellWidthList[0]}`}>{th}</TableBodyCell>
      <TableBodyCell className={`${cellWidthList[1]}`} bold>
        {name}
      </TableBodyCell>
      <TableBodyCell className={`${cellWidthList[2]}`}>
        {releaseDate}
      </TableBodyCell>
      <TableBodyCell className={`${cellWidthList[3]}`}>{dueDate}</TableBodyCell>
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
        <i>
          <img src="/icons/edit-icon.svg" alt="edit-icon" />
        </i>
      </TableBodyCell>
    </TableBodyRowBox>
  );
};

export default TableBodyRow;
