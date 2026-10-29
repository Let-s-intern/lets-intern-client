import { twMerge } from '@/lib/twMerge';
import { forwardRef, type InputHTMLAttributes } from 'react';

import { inputClassName, inputInvalidClassName } from './styles';

export const textInputClassName = inputClassName;

export const textInputInvalidClassName = inputInvalidClassName;

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  /** 에러 문구 id. invalid 일 때 aria-describedby 로 잇는다 */
  errorId?: string;
}

/** 에러 상태를 테두리와 aria-invalid 로 함께 드러내는 텍스트 입력 */
const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ invalid, errorId, className, ...props }, ref) {
    return (
      <input
        ref={ref}
        aria-invalid={invalid ? true : false}
        aria-describedby={invalid ? errorId : undefined}
        className={twMerge(
          textInputClassName,
          invalid && textInputInvalidClassName,
          className,
        )}
        {...props}
      />
    );
  },
);

export default TextInput;
