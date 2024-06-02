import React, { useState } from 'react';
import { CiTrash } from 'react-icons/ci';

import TextareaCell from './TextareaCell';
import LineTableBodyCell from './LineTableBodyCell';
import AlertModal from '../../../../ui/alert/AlertModal';
import {
  ITableContent,
  ItemWithStatus,
} from '../../../../../interfaces/interface';
import {
  STATUS,
  TABLE_CONTENT,
  missionTypeToText,
} from '../../../../../utils/convert';
import { formatMissionTableDateString } from '../../../../../utils/formatDateString';
import DropdownCell from './DropdownCell';

interface LineTableBodyRowProps<T extends ItemWithStatus> {
  item: T;
  attrNames: Array<keyof T>;
  placeholders?: string[];
  canEdits: boolean[];
  contents: ITableContent[];
  cellWidthList: string[];
  handleAdd: (item: T) => void;
  handleDelete: (item: T) => void;
  handleSave: (item: T) => void;
  children?: React.ReactNode;
}

/**
 * 테이블 바디 행 컴포넌트
 * @param item - 행에 표시할 객체 데이터
 * @param placeholders - 수정 모드 시, textarea에 표시할 placeholder 리스트 (순서 중요)
 * @param handleAdd - 데이터 추가 핸들러 (저장 X)
 * @param handleDelete - 데이터 삭제 핸들러 (저장 O)
 * @param cellWidthList - 행 너비 리스트 (순서 중요)
 * @param attrNames - 행에 넣을 객체 속성 리스트 (순서 중요)
 * @param canEdits - 행 수정 여부 리스트 (순서 중요)
 * @param contents - 행에 넣을 컨텐츠 타입 리스트 (순서 중요)
 */

const LineTableBodyRow = <T extends ItemWithStatus>({
  item: initialValues,
  placeholders = [],
  handleAdd,
  handleDelete,
  handleSave,
  cellWidthList,
  attrNames,
  canEdits,
  contents,
}: LineTableBodyRowProps<T>) => {
  const [values, setValues] = useState(initialValues as T);
  const [isEditMode, setIsEditMode] = useState(
    initialValues.status === STATUS.SAVE ? false : true,
  );
  const [isAlertShown, setIsAlertShown] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    // 드롭다운 선택 (type 속성 제외)
    if (e.target.type === 'select-one' && e.target.name !== 'type') {
      const target = e.target as EventTarget & HTMLSelectElement;
      // 미션명 드롭다운 선택
      if (e.target.name === 'title') {
        setValues((prev) => ({
          ...prev,
          [target.name]: target.options[target.selectedIndex].text,
        }));
        return;
      }
      setValues((prev) => ({
        ...prev,
        [target.name]: [
          {
            id: target.value,
            title: target.options[target.selectedIndex].text,
          },
        ],
      }));
      return;
    }
    // Textarea 입력
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex gap-px rounded-md border border-neutral-200 p-1 font-pretendard">
      {attrNames.map((attr, i) => {
        // 보증금 미션만 환급금액 표시
        if (attr === 'refund')
          return (
            <LineTableBodyCell key={i} className={cellWidthList[i]}>
              {values.type === 'REFUND' && (
                <TextareaCell
                  name={attr as string}
                  placeholder={placeholders[i] || ''}
                  value={values[attr] as string}
                  disabled={!canEdits[i] || !isEditMode}
                  onChange={handleChange}
                />
              )}
            </LineTableBodyCell>
          );

        if (contents[i].type === TABLE_CONTENT.INPUT)
          return (
            <LineTableBodyCell key={i} className={cellWidthList[i]}>
              <TextareaCell
                name={attr as string}
                placeholder={placeholders[i] || ''}
                value={values[attr] as string}
                disabled={!canEdits[i] || !isEditMode}
                onChange={handleChange}
              />
            </LineTableBodyCell>
          );

        // 유형, 미션명 드롭다운
        if (
          contents[i].type === TABLE_CONTENT.DROPDOWN &&
          (attr === 'type' || attr === 'title')
        ) {
          return (
            <LineTableBodyCell key={i} className={cellWidthList[i]}>
              {canEdits && isEditMode ? (
                <DropdownCell
                  selected={values[attr]}
                  name={attr as string}
                  optionList={contents[i].options as []}
                  onChange={handleChange}
                />
              ) : (
                <TextareaCell
                  name={attr as string}
                  placeholder={placeholders[i] || ''}
                  value={
                    attr === 'type'
                      ? missionTypeToText[values[attr]]
                      : values[attr]
                  }
                  disabled={true}
                  onChange={handleChange}
                />
              )}
            </LineTableBodyCell>
          );
        }

        if (contents[i].type === TABLE_CONTENT.DROPDOWN) {
          return (
            <LineTableBodyCell key={i} className={cellWidthList[i]}>
              {canEdits && isEditMode ? (
                <DropdownCell
                  selected={values[attr].length === 0 ? '' : values[attr][0].id}
                  name={attr as string}
                  optionList={contents[i].options as []}
                  onChange={handleChange}
                />
              ) : (
                <TextareaCell
                  name={attr as string}
                  placeholder={placeholders[i] || ''}
                  value={values[attr].length === 0 ? '' : values[attr][0].title}
                  disabled={true}
                  onChange={handleChange}
                />
              )}
            </LineTableBodyCell>
          );
        }

        if (contents[i].type === TABLE_CONTENT.DATE) {
          return (
            <LineTableBodyCell key={i} className={cellWidthList[i]}>
              {canEdits[i] && isEditMode ? (
                <input
                  type="date"
                  name={attr as string}
                  value={values[attr] as string}
                  onChange={handleChange}
                />
              ) : (
                <TextareaCell
                  name={attr as string}
                  placeholder={placeholders[i] || ''}
                  value={formatMissionTableDateString(
                    values[attr] as string,
                    attr === 'createDate'
                      ? ''
                      : canEdits[i]
                      ? '06:00'
                      : '23:59',
                  )}
                  disabled={true}
                />
              )}
            </LineTableBodyCell>
          );
        }

        return <LineTableBodyCell key={i} className={cellWidthList[i]} />;
      })}

      <LineTableBodyCell className="flex-1">
        {isEditMode ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                handleSave(values);
                handleAdd({ ...values, status: STATUS.SAVE });
                setIsEditMode(false);
              }}
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => {
                setValues(initialValues);
                if (initialValues.status === STATUS.SAVE) {
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
      </LineTableBodyCell>
    </div>
  );
};

export default LineTableBodyRow;
