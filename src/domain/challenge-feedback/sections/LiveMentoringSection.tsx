import { memo } from 'react';
import type { FeedbackDetailWithTiers, LiveMentoring } from '../types';

interface LiveMentoringSectionProps {
  liveMentoring: LiveMentoring;
  liveDetails: FeedbackDetailWithTiers[];
}

function VideoEmbed({ videoUrl }: { videoUrl: string }) {
  return videoUrl ? (
    <div className="aspect-video w-full overflow-hidden rounded-lg">
      <iframe
        src={videoUrl}
        title="1:1 LIVE 피드백 예시"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  ) : (
    <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-black/50">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
          <span className="text-2xl text-white/60">▶</span>
        </div>
        <p className="mt-3 text-sm text-gray-500">영상이 준비 중입니다</p>
      </div>
    </div>
  );
}

const LiveMentoringSection = memo(function LiveMentoringSection({
  liveMentoring,
  liveDetails,
}: LiveMentoringSectionProps) {
  return (
    <section className="flex w-full flex-col items-center justify-center bg-[#0C0A1D] py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="text-center text-xl font-bold text-white md:text-2xl">
          <span className="text-[#B49AFF]">1:1 LIVE</span> 피드백, 영상으로
          미리 확인하세요!
        </h2>
        <p className="mt-4 mb-10 text-center text-base text-gray-300 md:text-lg">
          {liveMentoring.subCopy1}
        </p>
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className="flex flex-col gap-10">
          {liveDetails.map((d) => (
            <div key={d.round}>
              <div className="mb-4 flex items-center justify-center gap-2">
                <h3 className="text-base font-semibold text-white md:text-lg">
                  {d.round}: {d.description}
                </h3>
                {d.tiers.map((tier) => (
                  <span
                    key={tier}
                    className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-gray-400"
                  >
                    {tier}
                  </span>
                ))}
              </div>
              <VideoEmbed videoUrl={liveMentoring.videoUrl} />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-8 text-center text-base text-gray-300 md:text-lg">
        {liveMentoring.subCopy2}
      </p>
    </section>
  );
});

export default LiveMentoringSection;
