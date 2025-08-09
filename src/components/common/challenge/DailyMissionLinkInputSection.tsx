import clsx from 'clsx';

interface Props {
  value: string;
  isEditing: boolean;
  isValidLinkValue: boolean;
  isLinkChecked: boolean;
  isStartedHttp: boolean;
  handleMissionLinkChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsLinkChecked: (checked: boolean) => void;
}

const DailyMissionLinkInputSection = ({
  value,
  isEditing,
  isValidLinkValue,
  isLinkChecked,
  isStartedHttp,
  handleMissionLinkChanged,
  setIsLinkChecked,
}: Props) => {
  return (
    <>
      <label
        htmlFor="link"
        className="text-xsmall14 font-semibold text-neutral-0"
      >
        링크
      </label>
      <p className="mt-1 text-xsmall14">
        {isEditing
          ? '미션 링크가 잘 열리는지 확인해 주세요. 제출 후 미션과 소감을 카톡으로 공유해야 미션 제출이 인정됩니다.'
          : '미션 제출이 완료되었습니다.'}
      </p>
      <div className="mt-3 flex items-stretch gap-4">
        <input
          type="text"
          className={clsx(
            'flex-1 cursor-text rounded-sm p-3 text-xsmall14 outline-none disabled:bg-neutral-95',
            {
              'text-neutral-400': !isEditing,
              'border-red-500': !isValidLinkValue && value && isEditing,
              'border-primary': isValidLinkValue && value && isEditing,
            },
          )}
          id="link"
          name="link"
          placeholder="제출할 링크를 입력해주세요."
          autoComplete="off"
          onChange={handleMissionLinkChanged}
          value={value}
          disabled={!isEditing}
        />
        <button
          type="button"
          className="rounded-sm bg-primary px-5 font-medium text-static-100 disabled:bg-neutral-70"
          onClick={() => {
            if (value) {
              Object.assign(document.createElement('a'), {
                target: '_blank',
                href: value,
                rel: 'noopenner noreferrer',
              }).click();
              setIsLinkChecked(true);
            }
          }}
          disabled={(!value && isEditing) || !isValidLinkValue}
        >
          링크 확인
        </button>
      </div>
      {value &&
        isEditing &&
        (isLinkChecked ? (
          <div className="text-0.75-medium mt-1 text-primary">
            링크 확인을 완료하셨습니다. 링크가 올바르다면 미션 소감 작성 후 제출
            버튼을 눌러주세요.
          </div>
        ) : !isValidLinkValue ? (
          <div className="text-0.75-medium mt-1 text-red-500">
            URL 형식이 올바르지 않습니다.
            {!isStartedHttp && <> (https:// 또는 http://로 시작해야 합니다.)</>}
          </div>
        ) : (
          <div className="text-0.75-medium mt-1 text-primary">
            URL을 올바르게 입력하셨습니다. 링크 확인을 진행해주세요.
          </div>
        ))}
    </>
  );
};

export default DailyMissionLinkInputSection;
