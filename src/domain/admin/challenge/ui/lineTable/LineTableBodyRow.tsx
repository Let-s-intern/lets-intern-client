import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import { TABLE_CONTENT, TABLE_STATUS } from '@/utils/convert';
import React, { useState } from 'react';
import { CiTrash } from 'react-icons/ci';
import AlertModal from '../../../../../common/alert/AlertModal';
import DropdownCell from './DropdownCell';
import LineTableBodyCell from './LineTableBodyCell';
import TextareaCell from './TextareaCell';

type StatusKey = keyof typeof TABLE_STATUS;

type TableContent =
  | InputTableContent
  | DropdownTableContent
  | DateTableContent
  | DateTimeTableContent;

interface InputTableContent {
  type: typeof TABLE_CONTENT.INPUT;
}

interface DropdownTableContent {
  type: typeof TABLE_CONTENT.DROPDOWN;
  options: { id: string | number; title: string }[];
}

interface DateTableContent {
  type: typeof TABLE_CONTENT.DATE;
}

interface DateTimeTableContent {
  type: typeof TABLE_CONTENT.DATETIME;
}
export interface ItemWithStatus {
  rowStatus?: (typeof TABLE_STATUS)[StatusKey];
}

interface LineTableBodyRowProps<T extends ItemWithStatus> {
  initialValues: T;
  attrNames: Array<keyof T>;
  placeholders?: string[];
  canEdits: boolean[];
  contents: TableContent[];
  cellWidthList: string[];
  onDelete?: (item: T) => void;
  onSave?: (item: T) => void;
  onCancel?: (item: T) => void;
  onClick?: (item: T) => void;
  children?: React.ReactNode;
  editable?: boolean;
  formatter?: (null | ((value: any) => any))[];
}

/**
 * 테이블 바디 행 컴포넌트
 * @param initialValues - 행에 표시할 객체 데이터
 * @param placeholders - 수정 모드 시, textarea에 표시할 placeholder 리스트 (순서 중요)
 * @param onSave - "저장" 버튼을 눌렀을 시
 * @param onCancel - "취소" 버튼을 눌렀을 시
 * @param onDelete - "삭제" 버튼을 눌렀을 시
 * @param onClick - 행을 클릭했을 시
 * @param cellWidthList - 행 너비 리스트 (순서 중요)
 * @param attrNames - 행에 넣을 객체 속성 리스트 (순서 중요)
 * @param canEdits - 행 수정 여부 리스트 (순서 중요)
 * @param editable - 수정/삭제가 가능한지 여부 (우측 버튼이 보이고 안보임) @deafult true
 * @param contents - 행에 넣을 컨텐츠 타입 리스트 (순서 중요)
 * @param formatter - 행에 넣을 데이터 포맷 함수 리스트 (순서 중요)
 */

const LineTableBodyRow = <T extends ItemWithStatus>({
  initialValues,
  placeholders = [],
  onDelete,
  onSave,
  onCancel,
  cellWidthList,
  attrNames,
  canEdits,
  contents,
  editable = true,
  onClick,
  formatter,
}: LineTableBodyRowProps<T>) => {
  const [values, setValues] = useState(initialValues as T);
  const [isEditMode, setIsEditMode] = useState(
    initialValues.rowStatus === TABLE_STATUS.SAVE ? false : true,
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
    <div
      className={twMerge(
        'flex gap-px rounded-md border border-neutral-200 p-1',
        onClick && 'cursor-pointer hover:bg-slate-50',
      )}
      onClick={() => onClick?.(values)}
    >
      {attrNames.map((_attr, i) => {
        const content = contents[i];
        // TODO: [나중에...] 타입 제대로 설정
        const attr = _attr as string;
        const value = values[attr as keyof T] as string;

        switch (content.type) {
          case TABLE_CONTENT.INPUT:
            return (
              <LineTableBodyCell key={i} className={cellWidthList[i]}>
                {canEdits[i] && isEditMode ? (
                  <TextareaCell
                    name={attr}
                    placeholder={placeholders[i] || ''}
                    value={value}
                    disabled={!canEdits[i] || !isEditMode}
                    onChange={handleChange}
                  />
                ) : formatter?.[i] ? (
                  (formatter?.[i]?.(value) ?? value)
                ) : (
                  value
                )}
              </LineTableBodyCell>
            );
          case TABLE_CONTENT.DROPDOWN:
            return (
              <LineTableBodyCell key={i} className={cellWidthList[i]}>
                {canEdits[i] && isEditMode ? (
                  <DropdownCell
                    selected={value}
                    name={attr}
                    optionList={content.options}
                    onChange={handleChange}
                  />
                ) : (
                  <TextareaCell
                    name={attr}
                    placeholder={placeholders[i] || ''}
                    value={
                      content.options.find((option) => option.id === value)
                        ?.title || ''
                    }
                    disabled={true}
                  />
                )}
              </LineTableBodyCell>
            );
          case TABLE_CONTENT.DATE:
            return (
              <LineTableBodyCell key={i} className={cellWidthList[i]}>
                {canEdits[i] && isEditMode ? (
                  <input
                    type="date"
                    name={attr}
                    value={value}
                    onChange={handleChange}
                  />
                ) : (
                  dayjs(value).format('YYYY-MM-DD HH:mm:ss')
                )}
              </LineTableBodyCell>
            );
          case TABLE_CONTENT.DATETIME:
            return (
              <LineTableBodyCell key={i} className={cellWidthList[i]}>
                {canEdits[i] && isEditMode ? (
                  <input
                    type="datetime-local"
                    name={attr}
                    value={value}
                    onChange={handleChange}
                  />
                ) : (
                  dayjs(value).format('YYYY-MM-DD HH:mm:ss')
                )}
              </LineTableBodyCell>
            );
          default:
            return <LineTableBodyCell key={i} className={cellWidthList[i]} />;
        }
      })}

      {editable ? (
        <LineTableBodyCell className="flex-1">
          {isEditMode ? (
            <div className="flex min-w-[100px] gap-2">
              <button
                type="button"
                onClick={() => {
                  onSave?.(values);
                  setIsEditMode(false);
                }}
              >
                저장
              </button>
              <button
                type="button"
                onClick={() => {
                  setValues(initialValues);
                  if (initialValues.rowStatus === TABLE_STATUS.SAVE) {
                    setIsEditMode(false);
                  } else {
                    onCancel?.(values);
                  }
                }}
              >
                취소
              </button>
            </div>
          ) : (
            <div
              className="flex min-w-[100px] items-center gap-3"
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
                      onDelete?.(values);
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
      ) : null}
    </div>
  );
};

export default LineTableBodyRow;
