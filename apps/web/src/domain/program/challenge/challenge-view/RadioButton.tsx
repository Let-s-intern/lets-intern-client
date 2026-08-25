import RadioChecked from '@/assets/icons/radio-checked.svg?react';
import RadioEmpty from '@/assets/icons/radio-empty.svg?react';
import clsx from 'clsx';

interface RadioButtonProps {
  color: string;
  checked: boolean;
  label: string;
  onClick: () => void;
  /**
   * 라벨 오른쪽에 덧붙일 요소. 선택값이라 기존 사용처는 그대로 둔다.
   * [임시] LC-3213 의 버전 태그가 유일한 사용처다. 그 작업이 걷히면 함께 지운다.
   */
  rightSlot?: React.ReactNode;
}

const RadioButton = ({
  color,
  checked,
  label,
  onClick,
  rightSlot,
}: RadioButtonProps) => {
  return (
    <div
      className="flex w-full cursor-pointer items-center gap-x-2"
      style={{ color }}
      onClick={onClick}
    >
      {checked ? (
        <RadioChecked className="h-5 w-5 md:h-6 md:w-6" />
      ) : (
        <RadioEmpty className="h-5 w-5 md:h-6 md:w-6" />
      )}
      <span
        className={clsx('text-xsmall14 text-neutral-0 md:text-xsmall16', {
          // rightSlot 이 붙으면 좁은 칸에서 날짜가 두 줄로 깨진다.
          // 날짜가 먼저 읽혀야 하므로 줄바꿈을 막고 오른쪽 요소가 줄어들게 한다.
          'shrink-0 whitespace-nowrap': Boolean(rightSlot),
        })}
      >
        {label}
      </span>
      {rightSlot}
    </div>
  );
};

export default RadioButton;
