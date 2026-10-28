import { twMerge } from '@/lib/twMerge';
import { forwardRef, type TextareaHTMLAttributes } from 'react';

import FormField, { fieldErrorId } from './FormField';
import { textInputClassName, textInputInvalidClassName } from './TextInput';

interface CounterTextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'name'
> {
  name: string;
  label: string;
  value: string;
  maxLength: number;
  error?: string;
}

/** 라벨 줄 오른쪽에 `입력 글자 수/최대` 를 보여주는 textarea 필드 */
const CounterTextarea = forwardRef<HTMLTextAreaElement, CounterTextareaProps>(
  function CounterTextarea(
    { name, label, value, maxLength, error, className, rows = 6, ...props },
    ref,
  ) {
    return (
      <FormField
        name={name}
        label={label}
        htmlFor={name}
        error={error}
        aside={
          <span className="text-xxsmall12 text-neutral-45">
            {value.length}/{maxLength}
          </span>
        }
      >
        <textarea
          ref={ref}
          id={name}
          name={name}
          value={value}
          rows={rows}
          maxLength={maxLength}
          aria-invalid={error ? true : false}
          aria-describedby={error ? fieldErrorId(name) : undefined}
          className={twMerge(
            textInputClassName,
            error && textInputInvalidClassName,
            className,
          )}
          {...props}
        />
      </FormField>
    );
  },
);

export default CounterTextarea;
