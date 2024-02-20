import clsx from 'clsx';

import { challengeSubmitDetailCellWidthList } from '../../../../../../utils/tableCellWidthList';

interface Props {
  className?: string;
}

const TableHead = ({ className }: Props) => {
  const cellWidthList = challengeSubmitDetailCellWidthList;

  return (
    <div
      className={clsx(
        'flex justify-between text-sm font-medium text-[#868686]',
        className,
      )}
    >
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[0],
        )}
      >
        번호
      </div>
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[1],
        )}
      >
        이름
      </div>
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[2],
        )}
      >
        메일
      </div>
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[3],
        )}
      >
        계좌번호
      </div>
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[4],
        )}
      >
        제출현황
      </div>
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[5],
        )}
      >
        미션
      </div>
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[6],
        )}
      >
        확인여부
      </div>
      <div
        className={clsx(
          'border-r border-[#D9D9D9] py-3 text-center',
          cellWidthList[7],
        )}
      >
        환급여부
      </div>
      <div className={clsx('py-3 text-center', cellWidthList[8])}>코멘트</div>
    </div>
  );
};

export default TableHead;
