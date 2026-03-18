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
    <section className="w-full bg-[#13112a] py-20">
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
