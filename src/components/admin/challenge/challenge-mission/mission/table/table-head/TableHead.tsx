import { missionCellWidthList } from '../../../../../../../utils/tableCellWidthList';
import TableHeadCell from '../../../ui/table/table-head/TableHeadCell';
import TableHeadBox from '../../../ui/table/table-head/TableHeadBox';

interface Props {
  className?: string;
}

const TableHead = ({ className }: Props) => {
  const cellWidthList = missionCellWidthList;

  return (
    <TableHeadBox className={className}>
      <TableHeadCell className={`${cellWidthList[0]}`}>번호</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[1]}`}>미션명</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[2]}`}>공개일</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[3]}`}>마감일</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[4]}`}>환급여부</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[5]}`}>
        연결콘텐츠
      </TableHeadCell>
      <TableHeadCell className={`${cellWidthList[6]}`}>제출현황</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[7]}`}>노출</TableHeadCell>
      <TableHeadCell className={`${cellWidthList[8]}`} />
    </TableHeadBox>
  );
};

export default TableHead;
