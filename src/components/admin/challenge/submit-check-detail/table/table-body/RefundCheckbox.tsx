import clsx from 'clsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { challengeSubmitDetailCellWidthList } from '../../../../../../utils/tableCellWidthList';
import axios from '../../../../../../utils/axios';
import { useState } from 'react';

interface Props {
  attendance: any;
  cellWidthListIndex: number;
}

const RefundCheckbox = ({ attendance, cellWidthListIndex }: Props) => {
  const queryClient = useQueryClient();

  const cellWidthList = challengeSubmitDetailCellWidthList;

  const editIsRefunded = useMutation({
    mutationFn: async (isRefund: boolean) => {
      const res = await axios.patch(`/attendance/${attendance.id}`, {
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
      {attendance && (
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
