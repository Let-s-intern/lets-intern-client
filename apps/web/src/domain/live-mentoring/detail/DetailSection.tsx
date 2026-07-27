import type { ReactNode } from 'react';

interface DetailSectionProps {
  title: string;
  children: ReactNode;
}

/** 상세 페이지 섹션 래퍼 (제목 + 본문). */
const DetailSection = ({ title, children }: DetailSectionProps) => {
  return (
    <section className="border-neutral-80 flex flex-col gap-4 border-t py-8">
      <h2 className="text-small18 font-bold">{title}</h2>
      {children}
    </section>
  );
};

export default DetailSection;
