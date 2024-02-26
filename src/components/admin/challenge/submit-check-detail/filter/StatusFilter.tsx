import clsx from 'clsx';
import { useState } from 'react';

import { challengeSubmitDetailCellWidthList } from '../../../../../utils/tableCellWidthList';
import { IoMdArrowDropdown } from 'react-icons/io';
import { attendanceStatusToText } from '../../../../../utils/convert';

interface Props {
  cellWidthListIndex: number;
  statusFilter: string;
  setStatusFilter: (statusFilter: string) => void;
}

const StatusFilter = ({
  cellWidthListIndex,
  statusFilter,
  setStatusFilter,
}: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cellWidthList = challengeSubmitDetailCellWidthList;

  const handleMenuClicked = (status: string) => {
    setIsMenuOpen(!isMenuOpen);
    setStatusFilter(status);
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
        <span>{attendanceStatusToText[statusFilter] || '제출현황'}</span>
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
          {Object.keys(attendanceStatusToText).map((status) => (
            <li
              className="cursor-pointer py-2 duration-200 hover:bg-neutral-200"
              onClick={() => handleMenuClicked(status)}
            >
              {attendanceStatusToText[status]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StatusFilter;
