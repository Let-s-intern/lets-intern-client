import CautionPriceContent from '../../../ui/price/CautionPriceContent';

interface CautionContentProps {
  cautionChecked: boolean;
  notice: string;
  onCautionChecked: () => void;
  program: any;
  couponDiscount: number;
}

const CautionContent = ({
  cautionChecked,
  notice,
  onCautionChecked,
  program,
  couponDiscount,
}: CautionContentProps) => {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-1.25-medium">필독사항</h1>
      <p className="mx-auto mt-5 flex flex-col gap-2 break-keep text-gray-500">
        {notice.split('\n').map((line, idx) => (
          <span key={idx}>
            {line}
            <br />
          </span>
        ))}
      </p>
      <div className="mt-5">
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={onCautionChecked}
        >
          <span className="block h-5 w-5">
            <img
              src={`/icons/checkbox-${
                cautionChecked ? 'checked' : 'unchecked'
              }.svg`}
              alt={`checked-${cautionChecked ? 'checked' : 'unchecked'}`}
              className="w-full translate-y-[0.5px]"
            />
          </span>
          <span className="text-gray-500">네, 알겠습니다.</span>
        </div>
      </div>
      <CautionPriceContent
        program={{
          feeType: program.feeType,
          feeCharge: program.feeCharge,
          feeRefund: program.feeRefund,
          discountValue: program.discountValue,
          accountType: program.accountType,
          accountNumber: program.accountNumber,
          feeDueDate: program.feeDueDate,
        }}
        couponDiscount={couponDiscount}
        className="mt-6"
      />
    </div>
  );
};

export default CautionContent;
