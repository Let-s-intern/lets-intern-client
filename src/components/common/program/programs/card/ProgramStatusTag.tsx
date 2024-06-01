import clsx from 'clsx';

import { PRGRAM_STATUS } from '../../../../../utils/programConst';

interface ProgramStatusTagProps {
  status: (typeof PRGRAM_STATUS)[keyof typeof PRGRAM_STATUS];
}

const ProgramStatusTag = ({ status }: ProgramStatusTagProps) => {
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
        'text-0.75-medium rounded-xs border px-2.5 py-0.5',
      )}
    >
      {status}
    </div>
  );
};

export default ProgramStatusTag;
