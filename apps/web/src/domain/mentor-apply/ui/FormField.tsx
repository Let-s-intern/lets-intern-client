import { twMerge } from '@/lib/twMerge';
import type { ReactNode } from 'react';

export const fieldErrorId = (name: string) => `${name}-error`;
export const fieldLabelId = (name: string) => `${name}-label`;

interface FormFieldProps {
  /** 폼 필드 이름. 첫 에러 필드로 스크롤할 때 `data-field` 로 찾는다 */
  name: string;
  label: string;
  /** 단일 입력이면 그 id. 없으면 묶음(group)으로 보고 라벨을 aria-labelledby 로 잇는다 */
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  /** 라벨 줄 오른쪽 (글자 수 카운터 등) */
  aside?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}

/** 라벨, 필수 표시, 보조 문구, 에러 문구를 둘러싼다 */
export default function FormField({
  name,
  label,
  htmlFor,
  required,
  hint,
  aside,
  error,
  className,
  children,
}: FormFieldProps) {
  const labelContent = (
    <>
      {label}
      {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      {hint ? (
        <span className="ml-2 text-sm font-normal text-zinc-500">{hint}</span>
      ) : null}
    </>
  );
  const labelClassName = 'text-[15px] font-semibold text-zinc-900';

  return (
    <div
      data-field={name}
      role={htmlFor ? undefined : 'group'}
      aria-labelledby={htmlFor ? undefined : fieldLabelId(name)}
      className={twMerge('flex flex-col gap-2', className)}
    >
      <div className="flex items-baseline justify-between gap-2">
        {htmlFor ? (
          <label htmlFor={htmlFor} className={labelClassName}>
            {labelContent}
          </label>
        ) : (
          <span id={fieldLabelId(name)} className={labelClassName}>
            {labelContent}
          </span>
        )}
        {aside}
      </div>
      {children}
      {error ? (
        <p id={fieldErrorId(name)} className="text-sm text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
