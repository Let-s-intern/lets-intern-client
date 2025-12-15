import clsx from 'clsx';

import { PROGRAM_CLASSIFICATION } from '../../../../utils/programConst';

interface ProgramClassificationTagProps {
  classification: (typeof PROGRAM_CLASSIFICATION)[keyof typeof PROGRAM_CLASSIFICATION];
}

const ProgramClassificationTag = ({
  classification,
}: ProgramClassificationTagProps) => {
  const getIconName = () => {
    if (classification === PROGRAM_CLASSIFICATION.CAREER_SEARCH)
      return 'search-eye-line.svg';
    if (classification === PROGRAM_CLASSIFICATION.DOCUMENT_PREPARATION)
      return 'document.svg';
    if (classification === PROGRAM_CLASSIFICATION.MEETING_PREPARATION)
      return 'checkbox-checked-tag.svg';
    return 'mingcute_celebrate-fill.svg';
  };

  return (
    <div
      className={clsx(
        {
          'border-[#00B347] bg-[#E3FAEB] text-[#00B347]':
            classification === PROGRAM_CLASSIFICATION.CAREER_SEARCH,
          'border-[#E59700] bg-[#FEF8D9] text-[#E59700]':
            classification === PROGRAM_CLASSIFICATION.DOCUMENT_PREPARATION,
          'border-[#FF6578] bg-[#FFEBEB] text-[#FF6578]':
            classification === PROGRAM_CLASSIFICATION.MEETING_PREPARATION,
          'border-[#8444FF] bg-[#F2ECFC] text-[#8444FF]':
            classification === PROGRAM_CLASSIFICATION.PASS,
        },
        'text-0.75-medium md:text-0.875-medium flex items-center justify-center gap-1 rounded-sm border-[1.4px] px-3 py-0.5',
      )}
    >
      <img
        className="h-3 w-3"
        src={`/icons/${getIconName()}`}
        alt="커리어 단계 아이콘"
      />
      <span>{classification}</span>
    </div>
  );
};

export default ProgramClassificationTag;
