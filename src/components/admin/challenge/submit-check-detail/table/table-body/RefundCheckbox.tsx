import clsx from 'clsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { challengeSubmitDetailCellWidthList } from '../../../../../../utils/tableCellWidthList';
import axios from '../../../../../../utils/axios';

interface Props {
  attendance: any;
  missionDetail: any;
  cellWidthListIndex: number;
  attendanceResult: string;
}

const RefundCheckbox = ({
  attendance,
  missionDetail,
  cellWidthListIndex,
  attendanceResult,
}: Props) => {
  const queryClient = useQueryClient();

  const cellWidthList = challengeSubmitDetailCellWidthList;

  const editIsRefunded = useMutation({
    mutationFn: async (isRefund: boolean) => {
      const res = await axios.patch(`/attendance/admin/${attendance.id}`, {
        isRefunded: isRefund,
      });
      const data = res.data;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['attendance'] });
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
            onClick={() => editIsRefunded.mutate(!attendance.isRefund)}
          >
            {attendance.isRefund ? (
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
