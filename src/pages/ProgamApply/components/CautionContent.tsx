import { CautionContentProps } from '../interface';

const CautionContent = ({
  cautionChecked,
  onCautionChecked,
}: CautionContentProps) => {
  return (
    <div className="text-center">
      <h1 className="text-lg font-medium">필독사항</h1>
      <p className="mx-auto mt-5 w-1/2 break-keep text-gray-500">
        2주간 코스별 목표 미션을 달성하기 위해 3일에 한번 정해진 날 23:59까지
        주어진 미션을 인증해야 합니다. 인턴 지원에 한걸음 다가가기 위해 열심히
        해주실 거죠?
      </p>
      <div className="mt-5 flex justify-center">
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={() => onCautionChecked()}
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
          <span className="text-gray-500">네, 물론이죠</span>
        </div>
      </div>
    </div>
  );
};

export default CautionContent;
