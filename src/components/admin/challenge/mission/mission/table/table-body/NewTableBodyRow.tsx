import clsx from 'clsx';
import { useState } from 'react';

import NTableBodyCell from '../../../../ui/table/table-body/NTableBodyCell';
import { formatMissionDateString } from '../../../../../../../utils/formatDateString';
import { missionManagementCellWidthList } from '../../../../../../../utils/tableCellWidthList';
import TextareaCell from '../../../../ui/table/table-body/TextareaCell';
import { IMissionTemplate } from '../../../../../../../interfaces/Mission.interface';

interface NewTableBodyRowProps {
  setList: React.Dispatch<React.SetStateAction<IMissionTemplate[]>>;
  setIsModeAdd: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewTableBodyRow = ({ setList, setIsModeAdd }: NewTableBodyRowProps) => {
  const cellWidthList = missionManagementCellWidthList;
  const initValues = {
    id: Date.now(),
    type: 'REFUND',
    topic: 'EXPERIENCE',
    status: 'WAITING',
    title: '',
    contents: '',
    guide: '',
    template: '',
    comments: '코멘트입니다',
    startDate: new Date().toISOString(),
    endDate: '2024-02-19T06:00:00',
    refund: 2000,
    refundTotal: 50000,
    essentialContentsTopic: 'EXPERIENCE',
    additionalContentsTopic: 'EXPERIENCE',
    limitedContentsTopic: null,
  };

  const [values, setValues] = useState(initValues);

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
          onChange={(e) => {
            setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
          }}
        />
      </NTableBodyCell>
      <NTableBodyCell className={clsx(cellWidthList[5])}>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setList((prev) => {
                const newItem = values;
                setIsModeAdd(false);
                setValues(initValues);
                return [newItem, ...prev];
              });
            }}
          >
            저장
          </button>
          <button
            type="button"
            onClick={() => {
              setIsModeAdd(false);
              setValues(initValues);
            }}
          >
            취소
          </button>
        </div>
      </NTableBodyCell>
    </div>
  );
};

export default NewTableBodyRow;
