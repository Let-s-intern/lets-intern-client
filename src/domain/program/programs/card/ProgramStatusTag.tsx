import clsx from 'clsx';

import { PROGRAM_STATUS } from '../../../../utils/programConst';

interface ProgramStatusTagProps {
  status: (typeof PROGRAM_STATUS)[keyof typeof PROGRAM_STATUS];
}

const ProgramStatusTag = ({ status }: ProgramStatusTagProps) => {
  return (
    <div
      className={clsx(
        {
          'border-primary bg-[#DBDDFD] text-primary':
            status === PROGRAM_STATUS.PROCEEDING,
          'border-secondary bg-[#E8F9F2] text-secondary':
            status === PROGRAM_STATUS.PREV,
          'border-neutral-45 bg-neutral-80 text-neutral-45':
            status === PROGRAM_STATUS.POST,
        },
        'text-0.75-medium md:text-0.875-medium rounded-xs border px-2.5 py-0.5',
      )}
    >
      {status}
    </div>
  );
};

export default ProgramStatusTag;
