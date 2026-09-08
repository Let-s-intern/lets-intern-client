import { ReactNode } from 'react';

interface SectionHeadingProps {
  /** 파란 소제목 라벨 */
  label: string;
  /** 메인 제목 */
  title: ReactNode;
  /** 부가 설명 (전달했을 때만 렌더) */
  description?: ReactNode;
  /** 래퍼 추가 클래스 */
  className?: string;
}

/**
 * 섹션 공통 헤더 (라벨 + 제목 + 선택적 설명).
 * 모바일은 좌측, 데스크탑은 중앙 정렬 — 합격 인증 폼 섹션 기준.
 */
export default function SectionHeading({
  label,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="flex w-full flex-col items-start gap-6 text-left md:items-center md:gap-[50px] md:text-center">
      <h3 className="md:text-xsmall16 text-xsmall14 text-primary font-semibold">
        {label}
      </h3>
      <div className="flex w-full flex-col items-start gap-3 text-left md:items-center md:text-center">
        <h2 className="text-medium24 text-neutral-0 font-bold leading-8 tracking-[-2.2%] md:text-[38px] md:leading-[49px]">
          {title}
        </h2>
        {description && (
          <p className="md:text-xsmall16 text-neutral-40 text-[13px] font-normal tracking-[-1.5%]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
