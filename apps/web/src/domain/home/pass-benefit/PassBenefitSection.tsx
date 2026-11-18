'use client';

import { useMembershipNavEntry } from '@/common/layout/header/useMembershipNavEntry';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import {
  PASS_BENEFITS_LEFT,
  PASS_BENEFITS_RIGHT,
  PASS_USAGE_DAYS,
  PassBenefit,
} from './passBenefitData';

const BenefitCard = ({
  benefit,
  href,
  className,
}: {
  benefit: PassBenefit;
  href: string;
  className?: string;
}) => {
  const Icon = benefit.icon;
  return (
    <Link
      href={href}
      className={clsx(
        'home_pass_benefit flex w-full items-center gap-4 rounded-md border border-neutral-85 bg-white px-5 py-4 md:px-6 md:py-5 xl:w-[360px]',
        className,
      )}
      data-text={benefit.title}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-primary-5">
        <Icon className={clsx('h-6 w-6', benefit.iconClassName)} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-xsmall16 font-bold text-neutral-0 md:text-small18">
          {benefit.title}
        </span>
        <span className="text-xsmall14 text-neutral-30">
          {benefit.description}
        </span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-neutral-30" />
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

      <div className="mt-10 flex w-full flex-col items-center gap-3 md:mt-16 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-center xl:gap-6">
        <Link
          href={href}
          className="home_pass_benefit_cta flex w-full flex-col items-center justify-center gap-1 rounded-[28px] bg-primary px-6 py-6 text-white md:gap-2 xl:order-2 xl:h-[160px] xl:w-[280px] xl:rounded-[48px]"
        >
          <span className="text-small20 font-bold md:text-xlarge28">
            혜택 자세히 보기
          </span>
          <span className="text-xsmall14 md:text-small18">
            총 {PASS_USAGE_DAYS}일 이용 가능
          </span>
        </Link>
        {/* 데스크톱: 가운데 카드만 바깥으로 밀어 시안처럼 둥글게 둘러싼다 */}
        <div className="flex w-full flex-col gap-3 xl:order-1 xl:items-end xl:gap-6">
          {PASS_BENEFITS_LEFT.map((benefit, i) => (
            <BenefitCard
              key={benefit.title}
              benefit={benefit}
              href={href}
              className={i === 1 ? 'xl:mr-8' : undefined}
            />
          ))}
        </div>
        <div className="flex w-full flex-col gap-3 xl:order-3 xl:items-start xl:gap-6">
          {PASS_BENEFITS_RIGHT.map((benefit, i) => (
            <BenefitCard
              key={benefit.title}
              benefit={benefit}
              href={href}
              className={i === 1 ? 'xl:ml-8' : undefined}
            />
          ))}
        </div>
      </div>

      <p className="mt-8 text-center text-xsmall14 text-neutral-40 md:mt-12 md:text-xsmall16">
        궁금한 혜택을 눌러 자세히 살펴보세요.
      </p>
    </section>
  );
};

export default PassBenefitSection;
