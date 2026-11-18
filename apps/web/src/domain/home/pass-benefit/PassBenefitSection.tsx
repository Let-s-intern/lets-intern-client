'use client';

import { useMembershipNavEntry } from '@/common/layout/header/useMembershipNavEntry';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { PASS_BENEFITS, PASS_USAGE_DAYS, PassBenefit } from './passBenefitData';

const BenefitCard = ({
  benefit,
  href,
}: {
  benefit: PassBenefit;
  href: string;
}) => {
  const Icon = benefit.icon;
  return (
    <Link
      href={href}
      className="home_pass_benefit flex w-full items-center gap-4 rounded-[16px] border border-[#E7E9F2] bg-white py-5 pl-5 pr-6 xl:h-[89px] xl:w-[320px]"
      data-text={benefit.title}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#EDEFFE]">
        <Icon className={clsx('h-6 w-6', benefit.iconClassName)} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-small18 font-bold text-neutral-0">
            {benefit.title}
          </span>
          <ChevronRight className="h-6 w-6 shrink-0 text-neutral-10" />
        </span>
        <span className="text-xsmall14 text-[#808799]">
          {benefit.description}
        </span>
      </span>
    </Link>
  );
};

/** 홈 "취업 준비, 올인원 패스 하나면 끝낼 수 있어요!" (시안 1118 Home) */
const PassBenefitSection = () => {
  const { href } = useMembershipNavEntry();

  return (
    <section className="mt-20 flex w-full max-w-[1120px] flex-col items-center px-5 md:mt-32 xl:px-0">
      <h2 className="text-center text-medium24 font-bold text-neutral-0 md:text-xxlarge36">
        취업 준비, <span className="text-primary">올인원 패스</span> 하나면 끝낼
        수 있어요!
      </h2>
      <p className="mt-3 text-center text-xsmall14 text-neutral-30 md:mt-4 md:text-small18">
        경험 정리부터 자소서·포폴, 인적성·면접까지.
        <br />
        필요한 자료와 현직자의 도움을 한 번에 이용해 보세요.
      </p>

      {/* 모바일·태블릿: 버튼 아래로 카드를 쌓는다. 데스크톱: 시안 좌표대로 버튼을 둘러싼다 */}
      <div className="relative mt-10 flex w-full flex-col gap-3 md:mt-16 xl:h-[432px] xl:w-[1016px]">
        <Link
          href={href}
          className="home_pass_benefit_cta flex w-full flex-col items-center justify-center gap-1 rounded-[28px] bg-[#4A76FF] px-6 py-6 text-white xl:absolute xl:left-[354px] xl:top-[116px] xl:h-[134px] xl:w-[310px] xl:gap-2 xl:rounded-[40px]"
        >
          <span className="text-small20 font-bold xl:text-[26px] xl:leading-9">
            혜택 자세히 보기
          </span>
          <span className="text-xsmall14 xl:text-small18">
            총 {PASS_USAGE_DAYS}일 이용 가능
          </span>
        </Link>
        {PASS_BENEFITS.map((benefit) => (
          <div
            key={benefit.title}
            className="xl:absolute xl:left-[var(--x)] xl:top-[var(--y)]"
            style={
              {
                '--x': `${benefit.position.left}px`,
                '--y': `${benefit.position.top}px`,
              } as React.CSSProperties
            }
          >
            <BenefitCard benefit={benefit} href={href} />
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xsmall14 text-neutral-40 md:mt-16 md:text-small18">
        궁금한 혜택을 눌러 자세히 살펴보세요.
      </p>
    </section>
  );
};

export default PassBenefitSection;
