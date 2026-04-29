interface CautionContentProps {
  contentIndex: number;
  criticalNotice: string;
  setContentIndex: (contentIndex: number) => void;
  isCautionChecked: boolean;
  setIsCautionChecked: (isCautionChecked: boolean) => void;
}

const CautionContent = ({
  contentIndex,
  criticalNotice,
  setContentIndex,
  isCautionChecked,
  setIsCautionChecked,
}: CautionContentProps) => {
  const handleNextButtonClick = () => {
    if (!isCautionChecked) return;
    setContentIndex(contentIndex + 1);
  };

  const handleBackButtonClick = () => {
    setContentIndex(contentIndex - 1);
  };

  const handleCautionCheck = () => {
    setIsCautionChecked(!isCautionChecked);
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <h2 className="text-neutral-0 font-medium">[필독사항]</h2>
      <p className="text-neutral-0 text-sm font-medium text-opacity-[88%]">
        {criticalNotice}
      </p>
      <div
        className="flex cursor-pointer items-center gap-2 px-1.5 py-2.5"
        onClick={handleCautionCheck}
      >
        {isCautionChecked ? (
          <div>
            <img src="/icons/circle-checked.svg" alt="체크됨" />
          </div>
        ) : (
          <div>
            <img src="/icons/circle-unchecked.svg" alt="체크됨" />
          </div>
        )}
        <span>네! 물론이죠.</span>
      </div>
      <div className="flex w-full items-center gap-2">
        <button
          className="border-primary text-primary-dark flex w-full flex-1 justify-center rounded-md border-2 bg-neutral-100 px-6 py-3 text-lg font-medium"
          onClick={handleBackButtonClick}
        >
          이전 단계로
        </button>
        <button
          className="must_button border-primary bg-primary disabled:border-neutral-70 disabled:bg-neutral-70 flex w-full flex-1 justify-center rounded-md border-2 px-6 py-3 text-lg font-medium text-neutral-100"
          onClick={handleNextButtonClick}
          disabled={!isCautionChecked}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default CautionContent;
