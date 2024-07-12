import dayjs from 'dayjs';
import { bankTypeToText } from '../../../../../../utils/convert';
import { PayInfo, ProgramDate } from '../../section/ApplySection';

interface PayInfoSectionProps {
  payInfo: PayInfo;
  // 결제 심사 용도로 만든 임시 결제인지 여부
  isTest?: boolean;
  programDate: ProgramDate;
}

const PayInfoSection = ({
  payInfo,
  isTest,
  programDate,
}: PayInfoSectionProps) => {
  return (
    <div className="flex flex-col gap-3">
      {isTest ? (
        <>
          <div className="w-full rounded-sm bg-neutral-95 p-4 text-sm">
            서비스 제공기간은 프로그램 진행기간과 동일합니다.
          </div>
          <div className="flex flex-col items-start justify-start p-1.5 text-neutral-0">
            <span className="text-sm">프로그램 기간 :</span>
            <span className="text-sm">
              {`${dayjs(programDate.startDate).format('YYYY년 M월 D일')} ~ ${dayjs(programDate.endDate).format('YYYY년 M월 D일')}`}
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="font-semibold text-neutral-0">결제 방법</div>
          <div>
            <div className="flex items-center justify-between p-1.5 text-neutral-0">
              <span className="text-sm">입금 계좌</span>
              <span className="text-sm">
                {bankTypeToText[payInfo.accountType]} {payInfo.accountNumber}
              </span>
            </div>
            <div className="flex items-center justify-between p-1.5 text-neutral-0">
              <span className="text-sm">입금 마감 기한</span>
              <span className="text-sm">
                {dayjs(payInfo.deadline).format('YYYY년 M월 D일 A hh시 mm분')}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PayInfoSection;
