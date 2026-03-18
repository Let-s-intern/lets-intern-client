import { memo } from 'react';
import BeforeAfterCard from '../components/BeforeAfterCard';
import type { BeforeAfter } from '../types';

interface BeforeAfterSectionProps {
  beforeAfter: BeforeAfter;
}

const BeforeAfterSection = memo(function BeforeAfterSection({
  beforeAfter,
}: BeforeAfterSectionProps) {
  return (
    <section className="flex w-full flex-col items-center justify-center bg-[#13112a] py-12 md:py-16">
      <h2 className="mb-10 text-center text-2xl font-bold text-white md:text-3xl">
        열 번의 수정보다{' '}
        <span className="text-[#B49AFF]">한 번의 확실한 피드백</span>
      </h2>
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 md:flex-row md:gap-12">
        <BeforeAfterCard
          type="before"
          image={beforeAfter.beforeImage}
          description={beforeAfter.beforeDescription}
        />
        <BeforeAfterCard
          type="after"
          image={beforeAfter.afterImage}
          description={beforeAfter.afterDescription}
        />
      </div>
    </section>
  );
});

export default BeforeAfterSection;
