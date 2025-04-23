import clsx from 'clsx';

import { AttendanceItem } from '@/schema';
import { challengeSubmitDetailCellWidthList } from '@/utils/tableCellWidthList';
import ResultFilter from '../../filter/ResultFilter';
import StatusFilter from '../../filter/StatusFilter';
import AllChoiceCheckbox from '../table-body/AllChoiceCheckbox';

interface Props {
  className?: string;
  attendances: AttendanceItem[];
  isCheckedList: number[];
  setIsCheckedList: (isCheckedList: number[]) => void;
  resultFilter: AttendanceItem['attendance']['result'];
  setResultFilter: (
    resultFilter: AttendanceItem['attendance']['result'],
  ) => void;
  statusFilter: AttendanceItem['attendance']['status'];
  setStatusFilter: (
    statusFilter: AttendanceItem['attendance']['status'],
  ) => void;
}

const TableHead = ({
  className,
  attendances,
  isCheckedList,
  setIsCheckedList,
  resultFilter,
  setResultFilter,
  statusFilter,
  setStatusFilter,
}: Props) => {
  const cellWidthList = challengeSubmitDetailCellWidthList;

  return (
    <div
      className={clsx(
        'flex justify-between text-sm font-medium text-[#868686]',
        className,
      )}
    >
      <AllChoiceCheckbox
        cellWidthListIndex={0}
        attendanceList={attendances}
        isCheckedList={isCheckedList}
        setIsCheckedList={setIsCheckedList}
      />
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[1],
        )}
      >
        제출일자
      </div>
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[2],
        )}
      >
        이름
      </div>
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[3],
        )}
      >
        메일
      </div>
      <StatusFilter
        cellWidthListIndex={4}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[5],
        )}
      >
        미션
      </div>
      <ResultFilter
        cellWidthListIndex={6}
        resultFilter={resultFilter}
        setResultFilter={setResultFilter}
      />
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[7],
        )}
      >
        코멘트
      </div>
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[8],
        )}
      >
        미션 소감
      </div>
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[9],
        )}
      >
        노출 여부
      </div>
    </div>
  );
};

export default TableHead;
