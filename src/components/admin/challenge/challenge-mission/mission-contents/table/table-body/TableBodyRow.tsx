import { missionContentsCellWidthList } from '../../../../../../../utils/tableCellWidthList';
import TableBodyCell from '../../../ui/table/table-body/TableBodyCell';
import TableBodyRowBox from '../../../ui/table/table-body/TableBodyRowBox';

interface Props {
  isRequired: boolean;
  name: string;
  releaseDate: string;
  mission: string;
  isVisible: boolean;
}

const TableBodyRow = ({
  isRequired,
  name,
  releaseDate,
  mission,
  isVisible,
}: Props) => {
  const cellWidthList = missionContentsCellWidthList;

  return (
    <TableBodyRowBox>
      <TableBodyCell className={`${cellWidthList[0]}`}>
        {isRequired ? '필수' : '선택'}
      </TableBodyCell>
      <TableBodyCell className={`${cellWidthList[1]}`} bold>
        {name}
      </TableBodyCell>
      <TableBodyCell className={`${cellWidthList[2]}`}>
        {releaseDate}
      </TableBodyCell>
      <TableBodyCell className={`${cellWidthList[3]}`}>{mission}</TableBodyCell>
      <TableBodyCell className={`${cellWidthList[4]}`}>
        {isVisible ? '노출' : '비노출'}
      </TableBodyCell>
      <TableBodyCell className={`${cellWidthList[5]}`}>
        <div className="flex items-center justify-center gap-10">
          <i>
            <img src="/icons/share-icon.svg" />
          </i>
          <i>
            <img src="/icons/edit-icon.svg" />
          </i>
        </div>
      </TableBodyCell>
    </TableBodyRowBox>
  );
};

export default TableBodyRow;
