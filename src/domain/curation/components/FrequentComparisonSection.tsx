'use client';

import FrequentComparisonCarousel from './comparison/FrequentComparisonCarousel';
import MobileFrequentComparison from './comparison/MobileFrequentComparison';

const FrequentComparisonSection = () => {
  return (
    <section
      className="flex w-full flex-col gap-8"
      id="curation-frequent-comparison"
    >
      {/* 데스크톱 캐러셀 */}
      <div className="hidden lg:block">
        <FrequentComparisonCarousel />
      </div>

      {/* 모바일 아코디언 */}
      <div className="lg:hidden">
        <MobileFrequentComparison />
      </div>
    </section>
  );
};

export default FrequentComparisonSection;
