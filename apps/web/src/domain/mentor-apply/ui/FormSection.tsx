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
      <legend className="border-neutral-80 text-small18 text-neutral-0 mb-5 w-full border-b pb-3 font-bold">
        {title}
        {description ? (
          <span className="text-xsmall16 text-neutral-30 mt-1.5 block font-normal">
            {description}
          </span>
        ) : null}
      </legend>
      {children}
    </fieldset>
  );
}
