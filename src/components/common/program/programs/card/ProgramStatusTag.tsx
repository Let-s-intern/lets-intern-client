import clsx from 'clsx';

import { PRGRAM_STATUS } from '../../../../../utils/convert';

interface ProgramStatusTagProps {
  startDate: string;
  endDate: string;
}

const ProgramStatusTag = ({ startDate, endDate }: ProgramStatusTagProps) => {
  const calculateStatus = (startDate: string, endDate: string) => {
    const currentDate = new Date();
    if (currentDate < new Date(startDate)) return PRGRAM_STATUS.PREV;
    if (currentDate > new Date(endDate)) return PRGRAM_STATUS.POST;
    return PRGRAM_STATUS.PROCEEDING;
  };
  const status = calculateStatus(startDate, endDate);

  return (
    <div
      className={clsx(
        {
          'border-primary bg-[#DBDDFD] text-primary':
            status === PRGRAM_STATUS.PROCEEDING,
          'border-secondary bg-[#E8F9F2] text-secondary':
            status === PRGRAM_STATUS.PREV,
          'border-neutral-45 bg-neutral-80 text-neutral-45':
            status === PRGRAM_STATUS.POST,
        },
        'text-0.75-medium rounded-md border px-2.5 py-0.5',
      )}
    >
      {status}
    </div>
  );
};

export default ProgramStatusTag;
