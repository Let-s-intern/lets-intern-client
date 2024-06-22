import clsx from 'clsx';
import { useState } from 'react';

import { challengeSubmitDetailCellWidthList } from '../../../../../utils/tableCellWidthList';
import { IoMdArrowDropdown } from 'react-icons/io';
import { attendanceStatusToText } from '../../../../../utils/convert';
import { Attendance } from '../../../../../schema';

interface Props {
  cellWidthListIndex: number;
  statusFilter: Attendance['status'];
  setStatusFilter: (statusFilter: Attendance['status']) => void;
}

const StatusFilter = ({
  cellWidthListIndex,
  statusFilter,
  setStatusFilter,
}: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cellWidthList = challengeSubmitDetailCellWidthList;

  const handleMenuClicked = (status: Attendance['status']) => {
    if (!status) {
      return;
    }
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
        <span>
          {statusFilter ? attendanceStatusToText[statusFilter] : '제출현황'}
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
          {Object.keys(attendanceStatusToText).map((status) => (
            <li
              key={status}
              className="cursor-pointer py-2 duration-200 hover:bg-neutral-200"
              onClick={() => handleMenuClicked(status as Attendance['status'])}
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
