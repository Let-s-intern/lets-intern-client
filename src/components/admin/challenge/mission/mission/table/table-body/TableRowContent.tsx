import clsx from 'clsx';
import { CiTrash } from 'react-icons/ci';

import TableBodyCell from '../../../../ui/table/table-body/TableBodyCell';
import TableBodyRowBox from '../../../../ui/table/table-body/TableBodyRowBox';
import { formatMissionDateString } from '../../../../../../../utils/formatDateString';
import { missionCellWidthList } from '../../../../../../../utils/tableCellWidthList';
import { topicToText } from '../../../../../../../utils/convert';
import DeleteButton from '../../button/DeleteButton';

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
        {topicToText[mission.essentialContentsTopic] || '없음'}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[5])}>O</TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[6])}>
        {mission.attendanceCount}
      </TableBodyCell>
      <TableBodyCell className={clsx(cellWidthList[7])}>
        <div
          className="flex items-center gap-3"
          onClick={(e) => e.stopPropagation}
        >
          <i
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setMenuShown('EDIT');
            }}
          >
            <img src="/icons/edit-icon.svg" alt="edit-icon" />
          </i>
          <DeleteButton mission={mission} />
        </div>
      </TableBodyCell>
    </TableBodyRowBox>
  );
};

export default TableRowContent;
