import { CautionContentProps } from '../interface';

const CautionContent = ({
  cautionChecked,
  notice,
  onCautionChecked,
}: CautionContentProps) => {
  return (
    <div className="text-center">
      <h1 className="text-lg font-medium">필독사항</h1>
      <p className="mx-auto mt-5 flex flex-col gap-2 break-keep text-gray-500">
        {notice.split('\n').map((line, idx) => (
          <span key={idx}>
            {line}
            <br />
          </span>
        ))}
      </p>
      <div className="mt-5 flex justify-center">
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
    </div>
  );
};

export default CautionContent;
