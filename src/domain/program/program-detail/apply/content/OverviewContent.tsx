import useAuthStore from '@/store/useAuthStore';
import { ProgramType } from '@/types/common';
import { newProgramTypeToText } from '@/utils/convert';
import { Dayjs } from 'dayjs';
import NotiButton from '../../button/NotiButton';
import DateToggle from '../../toggle/DateToggle';

interface OverviewContentProps {
  contentIndex: number;
  setContentIndex: (contentIndex: number) => void;
  programDate: {
    deadline: Dayjs | null;
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    beginning: Dayjs | null;
  };
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
  const { isLoggedIn } = useAuthStore();
  // const navigate = useNavigate();

  const handleNextButtonClick = () => {
    if (!isLoggedIn) {
      // navigate(`/login?redirect=${window.location.pathname}`);
      return;
    }
    setContentIndex(contentIndex + 2);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-xs font-medium">
        {programDate?.startDate?.get('year') || '2024'} [
        {newProgramTypeToText[programType.toUpperCase()]}]
      </div>
      <h2 className="text-lg font-semibold">{programTitle}</h2>
      {programDate.beginning && programDate.deadline && (
        <DateToggle programDate={programDate} programType={programType} />
      )}
      <div>
        {/* 모집 전이면 사전알림신청 버튼 표시 */}
        {!programDate.beginning || !programDate.deadline ? (
          <></>
        ) : new Date() < new Date(programDate.beginning?.toISOString()) ||
          new Date() > new Date(programDate.deadline?.toISOString()) ? (
          <NotiButton text={'출시알림신청'} className="early_button" />
        ) : (
          <button
            className="apply_button flex w-full justify-center rounded-md bg-primary px-6 py-3 text-lg font-medium text-neutral-100 disabled:bg-neutral-70"
            onClick={handleNextButtonClick}
            disabled={isApplied}
          >
            {isApplied ? '신청 완료' : '신청하기'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OverviewContent;
