import { missionContentsCellWidthList } from '../../../../../../../utils/tableCellWidthList';
import TableHeadBox from '../../../ui/table/table-head/TableHeadBox';
import TableHeadCell from '../../../ui/table/table-head/TableHeadCell';

const TableHead = () => {
  const cellWidthList = missionContentsCellWidthList;

  return (
    <TableHeadBox>
      <TableHeadCell className={`${cellWidthList[0]}`}>구분</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[1]}`}>콘텐츠</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[2]}`}>공개일</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[3]}`}>미션</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[4]}`}>노출</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[5]}`} />
    </TableHeadBox>
  );
};

export default TableHead;
