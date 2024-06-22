import { useNavigate } from 'react-router-dom';
import { ProgramType } from '../../../../../../pages/common/program/ProgramDetail';
import useAuthStore from '../../../../../../store/useAuthStore';
import { newProgramTypeToText } from '../../../../../../utils/convert';
import { ProgramDate } from '../../section/ApplySection';
import DateToggle from '../../toggle/DateToggle';
import NotiButton from '../../button/NotiButton';

interface OverviewContentProps {
  contentIndex: number;
  setContentIndex: (contentIndex: number) => void;
  programDate: ProgramDate;
  programType: ProgramType;
  programTitle: string;
  isApplied: boolean;
}

const OverviewContent = ({
  contentIndex,
  setContentIndex,
  programDate,
  programType,
  programTitle,
  isApplied,
}: OverviewContentProps) => {
  console.log('OverviewContent', programDate);
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear();
  };

  const handleNextButtonClick = () => {
    if (!isLoggedIn) {
      navigate(`/login?redirect=${window.location.pathname}`);
      return;
    }
    setContentIndex(contentIndex + 2);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-xs font-medium">
        {formatDateString(programDate?.startDate || '2024')} [
        {newProgramTypeToText[programType.toUpperCase()]}]
      </div>
      <h2 className="text-lg font-semibold">{programTitle}</h2>
      <DateToggle programDate={programDate} programType={programType} />
      <div>
        {new Date() < new Date(programDate.beginning) ||
        new Date() > new Date(programDate.deadline) ? (
          <NotiButton
            onClick={() => console.log('땡땡')}
            caption={'출시알림신청'}
          />
        ) : (
          <button
            className="flex w-full justify-center rounded-md bg-primary px-6 py-3 text-lg font-medium text-neutral-100 disabled:bg-neutral-70"
            onClick={handleNextButtonClick}
            disabled={isApplied}
          >
            {/* 모집 전이면 사전알림신청 버튼 표시 */}
            {isApplied ? '신청 완료' : '신청하기'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OverviewContent;
