import clsx from 'clsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { challengeSubmitDetailCellWidthList } from '../../../../../../utils/tableCellWidthList';
import axios from '../../../../../../utils/axios';

interface Props {
  attendance: any;
  missionDetail: any;
  cellWidthListIndex: number;
  attendanceResult: string;
  isRefunded: boolean;
  setIsRefunded: (isRefunded: boolean) => void;
}

const RefundCheckbox = ({
  attendance,
  missionDetail,
  cellWidthListIndex,
  attendanceResult,
  isRefunded,
  setIsRefunded,
}: Props) => {
  const cellWidthList = challengeSubmitDetailCellWidthList;

  const editIsRefunded = useMutation({
    mutationFn: async (isRefund: boolean) => {
      const res = await axios.patch(`/attendance/admin/${attendance.id}`, {
        isRefunded: isRefund,
      });
      const data = res.data;
      return data;
    },
    onSuccess: async (_, isRefund) => {
      setIsRefunded(isRefund);
    },
  });

  return (
    <div
      className={clsx(
        'flex items-center justify-center border-r border-[#D9D9D9]',
        cellWidthList[cellWidthListIndex],
      )}
    >
      {attendance &&
        attendanceResult === 'PASS' &&
        missionDetail.type === 'REFUND' && (
          <div
            className="cursor-pointer"
            onClick={() => editIsRefunded.mutate(!isRefunded)}
          >
            {isRefunded ? (
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
        )}
    </div>
  );
};

export default RefundCheckbox;
