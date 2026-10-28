import type { ReactNode } from 'react';

interface DetailSectionProps {
  title: string;
  children: ReactNode;
}

/** 신청 상세의 묶음 하나 */
const DetailSection = ({ title, children }: DetailSectionProps) => (
  <section className="border-neutral-80 flex flex-col gap-4 rounded-md border p-6">
    <h3 className="text-small18 text-neutral-0 font-bold">{title}</h3>
    {children}
  </section>
);

export default DetailSection;
