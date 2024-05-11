import clsx from 'clsx';

import { missionManagementCellWidthList } from '../../../../../../../utils/tableCellWidthList';
import TableHeadCell from '../../../../ui/table/table-head/TableHeadCell';
import TableHeadBox from '../../../../ui/table/table-head/TableHeadBox';

interface Props {
  className?: string;
}

const NTableHead = ({ className }: Props) => {
  const cellWidthList = missionManagementCellWidthList;

  return (
    <TableHeadBox className={className}>
      <TableHeadCell className={clsx(cellWidthList[0])}>생성일자</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[1])}>미션명</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[2])}>내용</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[3])}>가이드</TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[4])}>
        템플릿 링크
      </TableHeadCell>
      <TableHeadCell className={clsx(cellWidthList[5])}>관리</TableHeadCell>
    </TableHeadBox>
  );
};

export default NTableHead;
