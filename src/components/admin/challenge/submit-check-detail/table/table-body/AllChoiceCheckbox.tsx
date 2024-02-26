import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { challengeSubmitDetailCellWidthList } from '../../../../../../utils/tableCellWidthList';

interface Props {
  cellWidthListIndex: number;
  attendanceList: any;
  isCheckedList: any;
  setIsCheckedList: (isCheckedList: any) => void;
}

const AllChoiceCheckbox = ({
  cellWidthListIndex,
  attendanceList,
  isCheckedList,
  setIsCheckedList,
}: Props) => {
  const cellWidthList = challengeSubmitDetailCellWidthList;

  const allCheckedList = attendanceList.map((attendance: any) => attendance.id);

  const checkArrayEqual = (arr1: any, arr2: any) => {
    arr1 = arr1.sort();
    arr2 = arr2.sort();
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  };

  const [isChecked, setIsChecked] = useState(
    checkArrayEqual(isCheckedList, allCheckedList),
  );

  const handleCheckboxClicked = () => {
    if (isChecked) {
      setIsCheckedList([]);
    } else {
      setIsCheckedList(allCheckedList);
    }
  };

  useEffect(() => {
    setIsChecked(checkArrayEqual(isCheckedList, allCheckedList));
  }, [isChecked, isCheckedList, allCheckedList]);

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
