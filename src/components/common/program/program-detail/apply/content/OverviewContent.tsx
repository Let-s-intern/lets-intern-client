import { ProgramType } from '../../../../../../pages/common/program/ProgramDetail';
import { ProgramDate } from '../../section/ApplySection';
import DateToggle from '../../toggle/DateToggle';

interface OverviewContentProps {
  contentIndex: number;
  setContentIndex: (contentIndex: number) => void;
  programDate: ProgramDate;
  programType: ProgramType;
}

const OverviewContent = ({
  contentIndex,
  setContentIndex,
  programDate,
  programType,
}: OverviewContentProps) => {
  const handleNextButtonClick = () => {
    setContentIndex(contentIndex + 2);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-xs font-medium">2024 [챌린지]</div>
      <h2 className="text-lg font-semibold">인턴/신입 지원 챌린지 18기</h2>
      <DateToggle programDate={programDate} programType={programType} />
      <div>
        <button
          className="flex w-full justify-center rounded-md bg-primary px-6 py-3 text-lg font-medium text-neutral-100"
          onClick={handleNextButtonClick}
        >
          신청하기
        </button>
      </div>
    </div>
  );
};

export default OverviewContent;
