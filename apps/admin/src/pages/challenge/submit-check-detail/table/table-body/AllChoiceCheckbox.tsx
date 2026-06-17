import { AttendanceItem } from '@/schema';
import { challengeSubmitDetailCellWidthList } from '@/utils/tableCellWidthList';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface Props {
  cellWidthListIndex: number;
  attendanceList: AttendanceItem[];
  isCheckedList: number[];
  setIsCheckedList: (isCheckedList: number[]) => void;
}

const AllChoiceCheckbox = ({
  cellWidthListIndex,
  attendanceList,
  isCheckedList,
  setIsCheckedList,
}: Props) => {
  const cellWidthList = challengeSubmitDetailCellWidthList;

  const allCheckedList = attendanceList.map(({ attendance }) => attendance.id);

  function isArrayEqual<T>(arr1: T[], arr2: T[]) {
    arr1 = arr1.sort();
    arr2 = arr2.sort();
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

  const [isChecked, setIsChecked] = useState(
    isArrayEqual(isCheckedList, allCheckedList),
  );

  const handleCheckboxClicked = () => {
    if (isChecked) {
      setIsCheckedList([]);
    } else {
      setIsCheckedList(allCheckedList);
    }
  };

  useEffect(() => {
    setIsChecked(
      isArrayEqual(isCheckedList, allCheckedList) && attendanceList.length > 0,
    );
  }, [isChecked, isCheckedList, allCheckedList, attendanceList.length]);

  return (
    <div
      className={clsx(
        'flex justify-center border-r border-[#D9D9D9] py-3 text-center',
        cellWidthList[cellWidthListIndex],
      )}
    >
      <div className="cursor-pointer" onClick={handleCheckboxClicked}>
        {isChecked ? (
          <i>
            <img
              src="/icons/admin-checkbox-checked.svg"
              alt="checked-checkbox"
            />
          </i>
        ) : (
          <i>
            <img
              src="/icons/admin-checkbox-unchecked.svg"
              alt="unchecked-checkbox"
            />
          </i>
        )}
      </div>
    </div>
  );
};

export default AllChoiceCheckbox;
