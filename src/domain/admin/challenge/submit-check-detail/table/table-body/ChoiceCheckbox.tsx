import { challengeSubmitDetailCellWidthList } from '@/utils/tableCellWidthList';
import clsx from 'clsx';

interface Props {
  attendance: any;
  cellWidthListIndex: number;
  isChecked: boolean;
  setIsCheckedList: (isCheckedList: any) => void;
}

const ChoiceCheckbox = ({
  attendance,
  cellWidthListIndex,
  isChecked,
  setIsCheckedList,
}: Props) => {
  const cellWidthList = challengeSubmitDetailCellWidthList;

  const handleCheckboxClicked = () => {
    if (isChecked) {
      setIsCheckedList((prev: any) => {
        const newCheckedList = prev.filter(
          (checkedId: any) => checkedId !== attendance.id,
        );
        return newCheckedList;
      });
    } else {
      setIsCheckedList((prev: any) => {
        const newCheckedList = [...prev];
        newCheckedList.push(attendance.id);
        return newCheckedList;
      });
    }
  };

  return (
    <div
      className={clsx(
        'flex justify-center overflow-hidden text-ellipsis border-r border-[#D9D9D9] py-3 text-center text-sm',
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

export default ChoiceCheckbox;
