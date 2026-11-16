import clsx from 'clsx';
import { useEffect, useRef } from 'react';

interface TextareaCellProps {
  name: string;
  placeholder?: string;
  value: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

/**
 * 테이블 셀에 들어가는 Textarea 컴포넌트
 * @param name - Textarea name
 * @param placeholder - Textarea placeholder
 * @param value - Textarea value
 * @param disabled - Textarea disabled
 * @param onChange - Textarea change 이벤트 핸들러
 */

const TextareaCell = ({
  name,
  placeholder,
  value,
  disabled = false,
  onChange,
}: TextareaCellProps) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    ref.current!.style.height = `${ref.current!.scrollHeight}px`;
  });

  return (
    <textarea
      ref={ref}
      name={name}
      rows={1}
      className={clsx(
        {
          'rounded-md border border-neutral-200': !disabled,
        },
        'w-full resize-none overflow-hidden bg-static-100 p-2',
      )}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onChange={onChange}
    />
  );
};

export default TextareaCell;
