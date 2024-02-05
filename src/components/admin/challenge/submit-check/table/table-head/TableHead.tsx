import { missionSubmitCellWidthList } from '../../../../../../utils/tableCellWidthList';
import TableHeadBox from '../../../ui/table/table-head/TableHeadBox';
import TableHeadCell from '../../../ui/table/table-head/TableHeadCell';

const TableHead = () => {
  const cellWidthList = missionSubmitCellWidthList;

  return (
    <TableHeadBox>
      <TableHeadCell className={`${cellWidthList[0]}`}>구분</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[1]}`}>미션명</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[2]}`}>공개일</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[3]}`}>마감일</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[4]}`}>환급여부</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[5]}`}>
        연결콘텐츠
      </TableHeadCell>
      <TableHeadCell className={`${cellWidthList[6]}`}>제출현황</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[7]}`}>상태</TableHeadCell>
    </TableHeadBox>
  );
};

export default TableHead;
