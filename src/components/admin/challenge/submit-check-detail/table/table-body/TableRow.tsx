import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { challengeSubmitDetailCellWidthList } from '../../../../../../utils/tableCellWidthList';
import StatusDropdown from './StatusDropdown';
import RefundDropdown from './RefundDropdown';

interface Props {
  attendance?: any;
  th?: number;
  bgColor: 'DARK' | 'LIGHT';
}

const TableRow = ({ attendance, th, bgColor }: Props) => {
  const cellWidthList = challengeSubmitDetailCellWidthList;

  return (
    <div
      className={clsx('flex justify-between', {
        'bg-[#F1F1F1]': bgColor === 'DARK',
        'bg-[#F7F7F7]': bgColor === 'LIGHT',
      })}
    >
      <div
        className={clsx(
          'overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center text-sm',
          cellWidthList[0],
        )}
      >
        {th || ''}
      </div>
      <div
        className={clsx(
          'overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center text-sm',
          cellWidthList[1],
        )}
      >
        {attendance?.userName || <span className="opacity-0">hello</span>}
      </div>
      <div
        className={clsx(
          'overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center text-sm',
          cellWidthList[2],
        )}
      >
        {attendance?.userEmail || ''}
      </div>
      <div
        className={clsx(
          'overflow-hidden text-ellipsis whitespace-nowrap border-r border-[#D9D9D9] py-3 text-center text-sm',
          cellWidthList[3],
        )}
      >
        {attendance?.userAccountType || ''}{' '}
        {attendance?.userAccountNumber || ''}
      </div>
      <StatusDropdown attendance={attendance} />
      <div
        className={clsx(
          'overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center text-sm',
          cellWidthList[5],
        )}
      >
        {attendance && (
          <Link
            to={attendance.link}
            target="_blank"
            rel="noopenner noreferrer"
            className="rounded border border-zinc-600 px-4 py-[2px] text-xs duration-200 hover:bg-neutral-700 hover:text-white"
          >
            확인
          </Link>
        )}
      </div>
      <RefundDropdown attendance={attendance} />
      <div
        className={clsx(
          'overflow-hidden text-ellipsis py-3 text-center text-sm',
          cellWidthList[7],
        )}
      >
        {attendance?.comment || ''}
      </div>
    </div>
  );
};

export default TableRow;
