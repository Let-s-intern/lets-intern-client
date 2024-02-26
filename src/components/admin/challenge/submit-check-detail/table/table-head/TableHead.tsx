import clsx from 'clsx';

import { challengeSubmitDetailCellWidthList } from '../../../../../../utils/tableCellWidthList';
import AllChoiceCheckbox from '../table-body/AllChoiceCheckbox';
import ResultFilter from '../../filter/ResultFilter';
import StatusFilter from '../../filter/StatusFilter';

interface Props {
  className?: string;
  attendanceList: any;
  isCheckedList: any;
  setIsCheckedList: (isCheckedList: any) => void;
  resultFilter: string;
  setResultFilter: (resultFilter: string) => void;
  statusFilter: string;
  setStatusFilter: (statusFilter: string) => void;
}

const TableHead = ({
  className,
  attendanceList,
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
        attendanceList={attendanceList}
        isCheckedList={isCheckedList}
        setIsCheckedList={setIsCheckedList}
      />
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[1],
        )}
      >
        번호
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
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[4],
        )}
      >
        계좌번호
      </div>
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
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[8],
        )}
      >
        환급여부
      </div>
      <div className={clsx('py-3 text-center', cellWidthList[8])}>코멘트</div>
    </div>
  );
};

export default TableHead;
