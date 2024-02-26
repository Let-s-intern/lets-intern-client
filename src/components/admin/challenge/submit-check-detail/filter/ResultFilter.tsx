import clsx from 'clsx';
import { useState } from 'react';

import { challengeSubmitDetailCellWidthList } from '../../../../../utils/tableCellWidthList';
import { IoMdArrowDropdown } from 'react-icons/io';
import { attendanceResultToText } from '../../../../../utils/convert';

interface Props {
  cellWidthListIndex: number;
  resultFilter: string;
  setResultFilter: (resultFilter: string) => void;
}

const ResultFilter = ({
  cellWidthListIndex,
  resultFilter,
  setResultFilter,
}: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cellWidthList = challengeSubmitDetailCellWidthList;

  const handleMenuClicked = (result: string) => {
    setIsMenuOpen(!isMenuOpen);
    setResultFilter(result);
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
        <span>{attendanceResultToText[resultFilter] || '확인여부'}</span>
        <i>
          <IoMdArrowDropdown />
        </i>
      </div>
      {isMenuOpen && (
        <ul className="absolute bottom-0 z-30 w-full translate-y-full bg-white shadow">
          <li
            className="cursor-pointer py-2 duration-200 hover:bg-neutral-200"
            onClick={() => handleMenuClicked('')}
          >
            전체
          </li>
          {Object.keys(attendanceResultToText).map((result) => (
            <li
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
