import type { ReactNode } from 'react';

import { twMerge } from '@/lib/twMerge';

interface DetailSectionProps {
  /** 가운데 큰 제목. */
  title: string;
  /** 제목 위 작은 라벨 (예: "멘토 소개"). 시안 1·2·5에 있다. */
  label?: string;
  /** 제목 아래 보조 설명. */
  subtitle?: string;
  /** 어두운 배경 섹션 (시안 4·5). */
  dark?: boolean;
  /** 상단 앵커 탭이 스크롤해 올 지점. */
  id?: string;
  children: ReactNode;
}

/**
 * 상세 페이지 섹션 래퍼.
 *
 * 시안은 모든 섹션이 **가운데 정렬 헤더**(작은 라벨 → 큰 제목 → 보조 설명)를 갖고,
 * 섹션마다 배경이 라이트/다크로 갈린다. 배경색이 화면 폭 전체를 덮어야 해서
 * 래퍼가 full-bleed 를 담당하고 안쪽에서 `mw-1180` 으로 폭을 잡는다.
 */
const DetailSection = ({
  title,
  label,
  subtitle,
  dark,
  id,
  children,
}: DetailSectionProps) => (
  <section
    id={id}
    className={twMerge(
      'w-full scroll-mt-16 py-12 md:py-16',
      dark ? 'bg-neutral-0 text-static-100' : 'bg-white',
    )}
  >
    <div className="mw-1180 flex flex-col gap-6 px-5 md:gap-8">
      <header className="flex flex-col items-center gap-2 text-center">
        {/* 챌린지 상페의 SuperTitle 과 같은 스케일 */}
        {label && (
          <span
            className={twMerge(
              'text-xsmall14 md:text-small20 block font-semibold',
              dark ? 'text-primary-light' : 'text-neutral-40',
            )}
          >
            {label}
          </span>
        )}
        {/* 챌린지 상페의 Heading2 와 같은 스케일 */}
        {/* 제목이 길어지면 xlarge30 은 두세 줄로 번져 섹션이 과하게 높아진다.
            긴 제목은 한 단계 낮춰 잡는다. */}
        <h2
          className={twMerge(
            'whitespace-pre-line text-balance font-bold',
            title.length > 24
              ? 'text-small18 md:text-medium24'
              : 'text-small20 md:text-xlarge30',
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={twMerge(
              'text-xsmall14 md:text-small18',
              dark ? 'text-white/70' : 'text-neutral-40',
            )}
          >
            {subtitle}
          </p>
        )}
      </header>
      {children}
    </div>
  </section>
);

export default DetailSection;
