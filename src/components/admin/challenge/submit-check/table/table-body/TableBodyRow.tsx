import clsx from 'clsx';

import { missionSubmitCellWidthList } from '../../../../../../utils/tableCellWidthList';
import TableBodyCell from '../../../ui/table/table-body/TableBodyCell';
import TableBodyRowBox from '../../../ui/table/table-body/TableBodyRowBox';
import { Link } from 'react-router-dom';
import { formatMissionDateString } from '../../../../../../utils/formatDateString';
import { topicToText } from '../../../../../../utils/convert';

interface Props {
  th: number;
  mission: any;
}

const TableBodyRow = ({ th, mission }: Props) => {
  const cellWidthList = missionSubmitCellWidthList;

  const missionStatusToText: any = {
    CREATED: '시작 전',
    IN_PROGRESS: '진행 중',
    REFUND_WAITING: '환급대기',
    REFUND_DONE: '환급완료',
  };

  return (
    <Link to={`/admin/challenge/submit-check/${mission.id}`}>
      <TableBodyRowBox>
        <TableBodyCell className={clsx(cellWidthList[0])}>{th}</TableBodyCell>
        <TableBodyCell className={clsx(cellWidthList[1])} bold>
          {mission.title}
        </TableBodyCell>
        <TableBodyCell className={clsx(cellWidthList[2])}>
          {formatMissionDateString(mission.startDate)}
        </TableBodyCell>
        <TableBodyCell className={clsx(cellWidthList[3])}>
          {formatMissionDateString(mission.endDate)}
        </TableBodyCell>
        <TableBodyCell className={clsx(cellWidthList[4])}>
          {mission.isRefunded ? 'O' : 'X'}
        </TableBodyCell>
        <TableBodyCell className={clsx(cellWidthList[5])}>
          {topicToText[mission.essentialContentsTopic] || '없음'}
        </TableBodyCell>
        <TableBodyCell className={clsx(cellWidthList[6])}>
          {mission.attendanceCount}
        </TableBodyCell>
        <TableBodyCell className={clsx(cellWidthList[7])}>
          <div className="flex gap-3 font-medium">
            <span>{missionStatusToText[mission.status]}</span>
          </div>
        </TableBodyCell>
      </TableBodyRowBox>
    </Link>
  );
};

export default TableBodyRow;
