import { useRouter } from 'next/navigation';
import useAuthStore from '../../../../../store/useAuthStore';
import { ProgramType } from '../../../../../types/common';
import { newProgramTypeToText } from '../../../../../utils/convert';
import { ProgramDate } from '../../section/ApplySection';
import DateToggle from '../../toggle/DateToggle';

interface ScheduleContentProps {
  contentIndex: number;
  setContentIndex: (contentIndex: number) => void;
  programDate: ProgramDate;
  programType: ProgramType;
  programTitle: string;
  isApplied: boolean;
}

const ScheduleContent = ({
  contentIndex,
  setContentIndex,
  programDate,
  programType,
  programTitle,
  isApplied,
}: ScheduleContentProps) => {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  const handleNextButtonClick = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${window.location.pathname}`);
      return;
    }
    setContentIndex(contentIndex + 1);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-xs font-medium">
        {programDate?.startDate?.get('year') || '2024'} [
        {newProgramTypeToText[programType.toUpperCase()]}]
      </div>
      <h2 className="text-lg font-semibold">{programTitle}</h2>
      <DateToggle programDate={programDate} programType={programType} />
      <div>
        <button
          className={`text-1.125-medium flex w-full justify-center rounded-md bg-primary px-6 py-3 font-medium text-neutral-100 disabled:bg-neutral-70`}
          onClick={handleNextButtonClick}
          disabled={isApplied}
        >
          {/* 모집 전이면 사전알림신청 버튼 표시 */}
          {isApplied ? '신청 완료' : '신청 폼 입력하기'}
        </button>
      </div>
    </div>
  );
};

export default ScheduleContent;
