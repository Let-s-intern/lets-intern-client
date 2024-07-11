import dayjs from 'dayjs';
import { bankTypeToText } from '../../../../../../utils/convert';
import { PayInfo } from '../../section/ApplySection';

interface PayInfoSectionProps {
  payInfo: PayInfo;
  // 결제 심사 용도로 만든 임시 결제인지 여부
  isTest?: boolean;
}

const PayInfoSection = ({ payInfo, isTest }: PayInfoSectionProps) => {
  if (isTest) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
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
    </div>
  );
};

export default PayInfoSection;
