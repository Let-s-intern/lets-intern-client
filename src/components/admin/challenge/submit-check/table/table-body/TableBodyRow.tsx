import { missionSubmitCellWidthList } from '../../../../../../utils/tableCellWidthList';
import TableBodyCell from '../../../ui/table/table-body/TableBodyCell';
import TableBodyRowBox from '../../../ui/table/table-body/TableBodyRowBox';

interface Props {
  th: string;
  name: string;
  releaseDate: string;
  dueDate: string;
  isRefunded: boolean;
  connectedContents: string;
  submitCount: number;
  totalCount: number;
  checkStatus: 'DONE' | 'WAITING' | 'NONE';
  refundStatus: 'DONE' | 'WAITING' | 'NONE';
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
  checkStatus,
  refundStatus,
}: Props) => {
  const cellWidthList = missionSubmitCellWidthList;

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
        <div className="flex gap-3 font-medium">
          <span>
            {checkStatus === 'DONE'
              ? '확인완료'
              : checkStatus === 'WAITING'
              ? '확인대기'
              : checkStatus === 'NONE' && '해당없음'}
          </span>
          <span>
            {checkStatus === 'DONE'
              ? '환급완료'
              : checkStatus === 'WAITING'
              ? '환급대기'
              : checkStatus === 'NONE' && '해당없음'}
          </span>
        </div>
      </TableBodyCell>
    </TableBodyRowBox>
  );
};

export default TableBodyRow;
