import clsx from 'clsx';
import { CiTrash } from 'react-icons/ci';
import { useState } from 'react';

import NTableBodyCell from '../../../../ui/table/table-body/NTableBodyCell';
import { formatMissionDateString } from '../../../../../../../utils/formatDateString';
import { missionManagementCellWidthList } from '../../../../../../../utils/tableCellWidthList';
import AlertModal from '../../../../../../ui/alert/AlertModal';
import TextareaCell from '../../../../ui/table/table-body/TextareaCell';
import { IMissionTemplate } from '../../../../../../../interfaces/Mission.interface';

interface NTableBodyRowProps {
  item: IMissionTemplate;
  setList: React.Dispatch<React.SetStateAction<IMissionTemplate[]>>;
}

const NTableBodyRow = ({ item, setList }: NTableBodyRowProps) => {
  const cellWidthList = missionManagementCellWidthList;

  const [isAlertShown, setIsAlertShown] = useState(false);
  const [values, setValues] = useState(item);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className="flex gap-px rounded-md border border-neutral-200 p-1 font-pretendard">
      <NTableBodyCell className={clsx(cellWidthList[0])}>
        {/* 생성일자 필요 */}
        {formatMissionDateString(values.startDate)}
      </NTableBodyCell>
      <NTableBodyCell className={clsx(cellWidthList[1])}>
        <TextareaCell
          name="title"
          placeholder="미션명"
          value={values.title}
          disabled={!isEditMode}
          onChange={(e) => {
            setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
          }}
        />
      </NTableBodyCell>
      <NTableBodyCell className={clsx(cellWidthList[2])}>
        <TextareaCell
          name="contents"
          placeholder="내용"
          value={values.contents}
          disabled={!isEditMode}
          onChange={(e) => {
            setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
          }}
        />
      </NTableBodyCell>
      <NTableBodyCell className={clsx(cellWidthList[3])}>
        <TextareaCell
          name="guide"
          placeholder="가이드"
          value={values.guide}
          disabled={!isEditMode}
          onChange={(e) => {
            setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
          }}
        />
      </NTableBodyCell>
      <NTableBodyCell className={clsx(cellWidthList[4])}>
        {/* 클릭 시 링크 이동 */}
        <TextareaCell
          name="template"
          placeholder="템플릿 링크"
          value={values.template}
          disabled={!isEditMode}
          onChange={(e) => {
            setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
          }}
        />
      </NTableBodyCell>
      <NTableBodyCell className={clsx(cellWidthList[5])}>
        {isEditMode ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                // DB에 저장
                setIsEditMode(false);
              }}
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => {
                setValues(item);
                setIsEditMode(false);
              }}
            >
              취소
            </button>
          </div>
        ) : (
          <div
            className="flex items-center gap-3"
            onClick={(e) => e.stopPropagation}
          >
            {/* 수정 버튼 */}
            <i
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditMode(true);
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
                  onConfirm={() => {
                    // DB에서 삭제
                    setList((prev) => {
                      const i = prev.findIndex((el) => el.id === values.id);
                      return [...prev.splice(0, i), ...prev.splice(i + 1)];
                    });
                    setIsAlertShown(false);
                  }}
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
        )}
      </NTableBodyCell>
    </div>
  );
};

export default NTableBodyRow;
