import clsx from 'clsx';
import { CiTrash } from 'react-icons/ci';

import NTableBodyCell from '../../../../ui/table/table-body/NTableBodyCell';
import { formatMissionDateString } from '../../../../../../../utils/formatDateString';
import { missionManagementCellWidthList } from '../../../../../../../utils/tableCellWidthList';
import { useState } from 'react';
import AlertModal from '../../../../../../ui/alert/AlertModal';
import { IMissionTemplate } from '../../../../../../../interfaces/interface';

interface NTableBodyRowProps {
  mission: IMissionTemplate;
}

const NTableBodyRow = ({ mission }: NTableBodyRowProps) => {
  const cellWidthList = missionManagementCellWidthList;

  const [isAlertShown, setIsAlertShown] = useState(false);

  return (
    <div className="flex gap-6 rounded-md border border-neutral-200 px-3 font-pretendard">
      <NTableBodyCell className={clsx(cellWidthList[0])}>
        {/* 생성일자 필요 */}
        {formatMissionDateString(mission.startDate)}
      </NTableBodyCell>
      <NTableBodyCell className={clsx(cellWidthList[1])}>
        {mission.title}
      </NTableBodyCell>
      <NTableBodyCell className={clsx(cellWidthList[2])}>
        {mission.contents}
      </NTableBodyCell>
      <NTableBodyCell className={clsx(cellWidthList[3])}>
        {mission.guide}
      </NTableBodyCell>
      <NTableBodyCell className={clsx(cellWidthList[4])}>
        {/* 클릭 시 링크 이동 */}
        {mission.template}
      </NTableBodyCell>
      <NTableBodyCell className={clsx(cellWidthList[5])}>
        <div
          className="flex items-center gap-3"
          onClick={(e) => e.stopPropagation}
        >
          {/* 수정 버튼 */}
          <i
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              console.log('clicked');
            }}
          >
            <img src="/icons/edit-icon.svg" alt="edit-icon" />
          </i>
          {/* 삭제 버튼 */}
          <>
            <i
              className="cursor-pointer text-[1.75rem]"
              onClick={(e) => {
                e.stopPropagation();
                setIsAlertShown(true);
              }}
            >
              <CiTrash />
            </i>
            {isAlertShown && (
              <AlertModal
                onConfirm={() => console.log('delete')}
                title="미션 삭제"
                onCancel={(e) => {
                  e.stopPropagation();
                  setIsAlertShown(false);
                }}
              >
                정말로 삭제하시겠습니까?
              </AlertModal>
            )}
          </>
        </div>
      </NTableBodyCell>
    </div>
  );
};

export default NTableBodyRow;
