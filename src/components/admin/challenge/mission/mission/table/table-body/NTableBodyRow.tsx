import React, { useState } from 'react';
import { CiTrash } from 'react-icons/ci';

import TextareaCell from '../../../../ui/table/table-body/TextareaCell';
import NTableBodyCell from '../../../../ui/table/table-body/NTableBodyCell';
import AlertModal from '../../../../../../ui/alert/AlertModal';
import {
  IContent,
  ItemWithStatus,
} from '../../../../../../../interfaces/interface';
import {
  STATUS,
  TABLE_CONTENT,
  missionTypeToText,
} from '../../../../../../../utils/convert';

const missionTemplateList = [
  {
    id: 0,
    createDate: '2024-05-17T13:28:53.014Z',
    title: '미션1',
    description: '미션1 설명',
    guide: '미션1 가이드',
    templateLink: 'https://www.naver.com/',
  },
  {
    id: 1,
    createDate: '2024-05-17T13:28:53.014Z',
    title: '미션2',
    description: '미션2 설명',
    guide: '미션2 가이드',
    templateLink: 'https://www.naver.com/',
  },
  {
    id: 2,
    createDate: '2024-05-17T13:28:53.014Z',
    title: '미션3',
    description: '미션3 설명',
    guide: '미션3 가이드',
    templateLink: 'https://www.naver.com/',
  },
];

interface NTableBodyRowProps<T extends ItemWithStatus> {
  item: T;
  attrNames: Array<keyof T>;
  placeholders?: string[];
  canEdits: boolean[];
  contents: number[];
  cellWidthList: string[];
  handleAdd: (item: T) => void;
  handleDelete: (item: T) => void;
  children?: React.ReactNode;
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
  canEdits,
  contents,
}: NTableBodyRowProps<T>) => {
  const [values, setValues] = useState(initialValues as T);
  const [isEditMode, setIsEditMode] = useState(
    initialValues.status === STATUS.SAVE ? false : true,
  );
  const [isAlertShown, setIsAlertShown] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex gap-px rounded-md border border-neutral-200 p-1 font-pretendard">
      {attrNames.map((attr, i) => {
        if (attr === 'id') return <></>;
        if (contents[i] === TABLE_CONTENT.INPUT)
          return (
            <NTableBodyCell key={i} className={cellWidthList[i]}>
              <TextareaCell
                name={attr as string}
                placeholder={placeholders[i] || ''}
                value={values[attr] as string}
                disabled={!canEdits[i] || !isEditMode}
                onChange={handleChange}
              />
            </NTableBodyCell>
          );
        if (
          contents[i] === TABLE_CONTENT.DROPDOWN &&
          Array.isArray(values[attr])
        ) {
          const contents = values[attr] as IContent[];
          return (
            <select
              name={attr as string}
              className={cellWidthList[i]}
              id={`${attr as string}-select`}
              disabled={!canEdits[i] || !isEditMode}
            >
              {contents.map((content) => (
                <option value={content.title}>{content.title}</option>
              ))}
            </select>
          );
        }
        if (contents[i] === TABLE_CONTENT.DROPDOWN && attr === 'type') {
          return (
            <select
              name={attr as string}
              className={cellWidthList[i]}
              id={`${attr as string}-select`}
              disabled={!canEdits[i] || !isEditMode}
            >
              {Object.values(missionTypeToText).map((missionType) => (
                <option value={missionType as string}>
                  {missionType as string}
                </option>
              ))}
            </select>
          );
        }
        if (contents[i] === TABLE_CONTENT.DROPDOWN && attr === 'title') {
          return (
            <select
              name={attr as string}
              className={cellWidthList[i]}
              id={`${attr as string}-select`}
              disabled={!canEdits[i] || !isEditMode}
            >
              {missionTemplateList.map((missionTemplate) => (
                <option value={missionTemplate.title}>
                  {missionTemplate.title}
                </option>
              ))}
            </select>
          );
        } else return <div className={cellWidthList[i]}></div>;
      })}

      <NTableBodyCell className="flex-1">
        {isEditMode ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const newValues = { ...values, status: STATUS.SAVE };
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
      </NTableBodyCell>
    </div>
  );
};

export default NTableBodyRow;
