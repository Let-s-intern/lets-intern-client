import clsx from 'clsx';
import { useState } from 'react';

import { challengeSubmitDetailCellWidthList } from '../../../../../utils/tableCellWidthList';
import { IoMdArrowDropdown } from 'react-icons/io';
import { Attendance } from '../../../../../schema';

interface Props {
  cellWidthListIndex: number;
  resultFilter: Attendance['result'];
  setResultFilter: (resultFilter: Attendance['result']) => void;
}

const attendanceResultToText: Record<
  Exclude<Attendance['result'], null>,
  string
> = {
  WAITING: '확인중',
  PASS: '확인 완료',
  WRONG: '반려',
};

const ResultFilter = ({
  cellWidthListIndex,
  resultFilter,
  setResultFilter,
}: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cellWidthList = challengeSubmitDetailCellWidthList;

  const handleMenuClicked = (result: Attendance['result']) => {
    if (result) {
      setIsMenuOpen(!isMenuOpen);
      setResultFilter(result);
    }
  };

  return (
    <div
      className={clsx(
        'relative flex items-center justify-center border-r border-[#D9D9D9] py-3 text-center',
        cellWidthList[cellWidthListIndex],
      )}
    >
      <div
        className="flex cursor-pointer items-center gap-1"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span>
          {resultFilter ? attendanceResultToText[resultFilter] : '확인여부'}
        </span>
        <i>
          <IoMdArrowDropdown />
        </i>
      </div>
      {isMenuOpen && (
        <ul className="absolute bottom-0 z-30 w-full translate-y-full bg-white shadow">
          <li
            className="cursor-pointer py-2 duration-200 hover:bg-neutral-200"
            onClick={() => handleMenuClicked(null)}
          >
            전체
          </li>
          {(["WAITING", "PASS", "WRONG"] as const).map((result) => (
            <li
              key={result}
              className="cursor-pointer py-2 duration-200 hover:bg-neutral-200"
              onClick={() => handleMenuClicked(result)}
            >
              {attendanceResultToText[result]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResultFilter;
