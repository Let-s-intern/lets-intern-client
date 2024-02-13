import clsx from 'clsx';

import TableBodyCell from '../../../../ui/table/table-body/TableBodyCell';
import TableBodyRowBox from '../../../../ui/table/table-body/TableBodyRowBox';
import { formatMissionDateString } from '../../../../../../../utils/formatDateString';
import { missionCellWidthList } from '../../../../../../../utils/tableCellWidthList';
import { topicToText } from '../../../../../../../utils/convert';

interface Props {
  th: number;
  mission: any;
  menuShown: 'DETAIL' | 'EDIT' | 'NONE';
  setMenuShown: (menuShown: 'DETAIL' | 'EDIT' | 'NONE') => void;
}

const TableRowContent = ({ th, mission, menuShown, setMenuShown }: Props) => {
  const cellWidthList = missionCellWidthList;

  return (
    <TableBodyRowBox
      onClick={() => setMenuShown(menuShown !== 'DETAIL' ? 'DETAIL' : 'NONE')}
    >
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
        {mission.isVisible ? '노출' : '비노출'}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[8])}>
        <i
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setMenuShown('EDIT');
          }}
        >
          <img src="/icons/edit-icon.svg" alt="edit-icon" />
        </i>
      </TableBodyCell>
    </TableBodyRowBox>
  );
};

export default TableRowContent;
