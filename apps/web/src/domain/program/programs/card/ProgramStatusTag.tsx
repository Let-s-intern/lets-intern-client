import clsx from 'clsx';

import { PROGRAM_BADGE_STATUS } from '../../../../utils/programConst';

interface ProgramStatusTagProps {
  status:
    | (typeof PROGRAM_BADGE_STATUS)[keyof typeof PROGRAM_BADGE_STATUS]
    | '상시 판매';
}

const ProgramStatusTag = ({ status }: ProgramStatusTagProps) => {
  return (
    <div
      className={clsx(
        {
          'border-primary-10 bg-primary-10 text-primary':
            status === PROGRAM_BADGE_STATUS.PROCEEDING,
          'border-primary-10 bg-primary-10 text-neutral-35':
            status === PROGRAM_BADGE_STATUS.PREV,
          'border-neutral-95 bg-neutral-95 text-neutral-40':
            status === PROGRAM_BADGE_STATUS.POST,
          'border-[#E7F2FF] bg-[#E7F2FF] text-[#006CEC]':
            status === '상시 판매',
        },
        'flex items-center justify-center rounded-[3px] border px-2 py-1 text-center text-xxsmall12 font-normal',
      )}
    >
      <span>{status}</span>
    </div>
  );
};

export default ProgramStatusTag;
