import Image from 'next/image';
import { memo } from 'react';
import type { LiveFeedbackGuide } from '../types';

interface LiveFeedbackGuideSectionProps {
  liveFeedbackGuide: LiveFeedbackGuide;
}

const LiveFeedbackGuideSection = memo(function LiveFeedbackGuideSection({
  liveFeedbackGuide,
}: LiveFeedbackGuideSectionProps) {
  return (
    <section className="flex w-full flex-col items-center justify-center bg-[#0e0c22] py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="text-center text-lg font-bold text-white md:text-2xl">
          <span className="text-[#B49AFF]">1:1 LIVE</span> 피드백
        </h2>
        <p className="mt-3 text-center text-base font-semibold text-white md:text-xl">
          {liveFeedbackGuide.title}
        </p>
        <p className="mb-10 mt-4 text-center text-sm text-gray-300 md:text-lg">
          {liveFeedbackGuide.subCopy}
        </p>
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className="w-full overflow-hidden rounded-lg">
          <Image
            src={liveFeedbackGuide.imageUrl}
            alt="1:1 LIVE 피드백 안내"
            width={1200}
            height={800}
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
});

export default LiveFeedbackGuideSection;
