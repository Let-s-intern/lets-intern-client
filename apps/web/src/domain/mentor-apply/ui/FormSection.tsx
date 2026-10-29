import type { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/** 신청서의 한 묶음. 제목 아래 구분선을 둔다 */
export default function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <fieldset className="flex flex-col gap-5">
      <legend className="mb-5 w-full border-b border-zinc-200 pb-3 text-lg font-bold text-zinc-900">
        {title}
        {description ? (
          <span className="mt-1.5 block text-[15px] font-normal text-zinc-600">
            {description}
          </span>
        ) : null}
      </legend>
      {children}
    </fieldset>
  );
}
