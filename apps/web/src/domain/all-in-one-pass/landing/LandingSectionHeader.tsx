import SectionHeader from '@/common/header/SectionHeader';
import SectionSubHeader from '@/common/header/SectionSubHeader';
import { twMerge } from '@/lib/twMerge';
import type { ReactNode } from 'react';

interface Props {
  header: ReactNode; // 소제목(주황)
  mainHeader: ReactNode; // 제목
  subHeader?: ReactNode; // 설명(muted)
  className?: string;
}

/** 랜딩 섹션 공통 헤더 — 소제목·제목·설명. */
export default function LandingSectionHeader({
  header,
  mainHeader,
  subHeader,
  className,
}: Props) {
  return (
    <div
      className={twMerge(
        'flex flex-col gap-4 text-left md:text-center',
        className,
      )}
    >
      <SectionHeader className="py-2 text-left text-[#F36D32] md:text-center">
        {header}
      </SectionHeader>
      <h2 className="whitespace-pre-line text-left text-medium24 font-bold text-neutral-0 md:text-center md:text-[40px]">
        {mainHeader}
      </h2>
      {subHeader && (
        <SectionSubHeader className="text-left text-xsmall14 font-normal text-neutral-40 md:text-center md:text-small20">
          {subHeader}
        </SectionSubHeader>
      )}
    </div>
  );
}
