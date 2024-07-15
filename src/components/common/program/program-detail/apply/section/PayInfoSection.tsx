import dayjs from 'dayjs';
import { PayInfo, ProgramDate } from '../../section/ApplySection';

interface PayInfoSectionProps {
  payInfo: PayInfo;
  programDate: ProgramDate;
}

const PayInfoSection = ({ payInfo, programDate }: PayInfoSectionProps) => {
  return (
    <div className="flex flex-col gap-3">
      {/* 수정 */}
      <div className="w-full rounded-sm bg-neutral-95 p-4 text-sm">
        서비스 제공기간은 프로그램 진행기간과 동일합니다.
      </div>
      <div className="flex flex-col items-start justify-start p-1.5 text-neutral-0">
        <span className="text-sm">프로그램 기간 :</span>
        <span className="text-sm">
          {`${dayjs(programDate.startDate).format('YYYY년 M월 D일')} ~ ${dayjs(programDate.endDate).format('YYYY년 M월 D일')}`}
        </span>
      </div>
    </div>
  );
};

export default PayInfoSection;
