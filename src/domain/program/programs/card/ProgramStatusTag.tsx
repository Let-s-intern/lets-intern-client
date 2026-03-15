import clsx from 'clsx';

import { PROGRAM_STATUS } from '../../../../utils/programConst';

interface ProgramStatusTagProps {
  status: (typeof PROGRAM_STATUS)[keyof typeof PROGRAM_STATUS] | '상시 판매';
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
          'border-[#9B7AE4] bg-[#F2ECFC] text-[#9B7AE4]':
            status === '상시 판매',
        },
        'rounded-xs border px-2 py-0.5 text-xxsmall10 font-medium md:text-xxsmall12',
      )}
    >
      {status}
    </div>
  );
};

export default ProgramStatusTag;
