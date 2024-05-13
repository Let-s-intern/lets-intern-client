import React, { useState } from 'react';
import { CiTrash } from 'react-icons/ci';

import TextareaCell from '../../../../ui/table/table-body/TextareaCell';
import NTableBodyCell from '../../../../ui/table/table-body/NTableBodyCell';
import { formatMissionDateString } from '../../../../../../../utils/formatDateString';
import AlertModal from '../../../../../../ui/alert/AlertModal';
import { ItemWithStatus } from '../../../../../../../interfaces/interface';
import { statusEnum } from '../../../../../../../utils/convert';

interface NTableBodyRowProps<T extends ItemWithStatus> {
  item: T;
  attrNames: Array<keyof T>;
  placeholders?: string[];
  canEdits: boolean[];
  cellWidthList: string[];
  handleAdd: (item: T) => void;
  handleDelete: (item: T) => void;
}

/**
 * 테이블 바디 행 컴포넌트
 * @param item - 행에 표시할 객체 데이터
 * @param placeholders - 수정 모드 시, textarea에 표시할 placeholder 리스트 (순서 중요)
 * @param handleSave - 데이터 추가 핸들러 (저장 X)
 * @param handleDelete - 데이터 삭제 핸들러 (저장 O)
 * @param cellWidthList - 행 너비 리스트 (순서 중요)
 * @param attrNames - 행에 넣을 객체 속성 리스트 (순서 중요)
 */

const NTableBodyRow = <T extends ItemWithStatus>({
  item: initialValues,
  placeholders = [],
  handleAdd,
  handleDelete,
  cellWidthList,
  attrNames,
}: NTableBodyRowProps<T>) => {
  const [values, setValues] = useState(initialValues);
  const [isEditMode, setIsEditMode] = useState(
    initialValues.status === statusEnum.SAVE ? false : true,
  );
  const [isAlertShown, setIsAlertShown] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex gap-px rounded-md border border-neutral-200 p-1 font-pretendard">
      {attrNames.map((attr, i) => {
        if (attr === 'id') return <></>;
        return (
          <NTableBodyCell key={i} className={cellWidthList[i]}>
            {attr === 'createdAt' ? (
              formatMissionDateString(values[attr] as string)
            ) : (
              <TextareaCell
                name={attr as string}
                placeholder={placeholders[i] || ''}
                value={values[attr] as string}
                disabled={!isEditMode}
                onChange={handleChange}
              />
            )}
          </NTableBodyCell>
        );
      })}

      <NTableBodyCell className="flex-1">
        {isEditMode ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const newValues = { ...values, status: statusEnum.SAVE };
                handleAdd(newValues);
                setIsEditMode(false);
              }}
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => {
                setValues(initialValues);
                if (initialValues.status === statusEnum.SAVE) {
                  setIsEditMode(false);
                } else {
                  handleDelete(values);
                }
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
                    handleDelete(values);
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
