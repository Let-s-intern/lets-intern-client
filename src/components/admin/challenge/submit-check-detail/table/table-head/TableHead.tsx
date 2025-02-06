import clsx from 'clsx';

import { Attendance } from '../../../../../../schema';
import { challengeSubmitDetailCellWidthList } from '../../../../../../utils/tableCellWidthList';
import ResultFilter from '../../filter/ResultFilter';
import StatusFilter from '../../filter/StatusFilter';
import AllChoiceCheckbox from '../table-body/AllChoiceCheckbox';

interface Props {
  className?: string;
  attendances: Attendance[];
  isCheckedList: number[];
  setIsCheckedList: (isCheckedList: number[]) => void;
  resultFilter: Attendance['result'];
  setResultFilter: (resultFilter: Attendance['result']) => void;
  statusFilter: Attendance['status'];
  setStatusFilter: (statusFilter: Attendance['status']) => void;
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
      {/* <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[1],
        )}
      >
        번호
      </div> */}
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
      {/* <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[4],
        )}
      >
        계좌번호
      </div> */}
      <StatusFilter
        cellWidthListIndex={5}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[6],
        )}
      >
        미션
      </div>
      <ResultFilter
        cellWidthListIndex={7}
        resultFilter={resultFilter}
        setResultFilter={setResultFilter}
      />
      {/* <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[8],
        )}
      >
        환급여부
      </div> */}
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[8],
        )}
      >
        코멘트
      </div>
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[9],
        )}
      >
        미션 소감
      </div>
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[10],
        )}
      >
        노출 여부
      </div>
    </div>
  );
};

export default TableHead;
