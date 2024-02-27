import clsx from 'clsx';

import TableBodyRowBox from '../../../ui/table/table-body/TableBodyRowBox';
import TableBodyCell from '../../../ui/table/table-body/TableBodyCell';
import { formatMissionDateString } from '../../../../../../utils/formatDateString';
import {
  missionStatusToText,
  topicToText,
} from '../../../../../../utils/convert';
import { missionSubmitCellWidthList } from '../../../../../../utils/tableCellWidthList';
import StatusDropdown from './StatusDropdown';

interface Props {
  th: number;
  mission: any;
  onClick?: () => void;
}

const TableRowContent = ({ th, mission, onClick }: Props) => {
  const cellWidthList = missionSubmitCellWidthList;

  return (
    <TableBodyRowBox onClick={onClick}>
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
        {topicToText[mission.essentialContentsTopic] || '없음'}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[5])}>
        {mission.attendanceCount} / {mission.finalHeadCount}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[6])}>
        <StatusDropdown mission={mission} />
      </TableBodyCell>
    </TableBodyRowBox>
  );
};

export default TableRowContent;
