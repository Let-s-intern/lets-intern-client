import { memo } from 'react';
import type { LiveMentoring } from '../types';

interface LiveMentoringSectionProps {
  liveMentoring: LiveMentoring;
}

const LiveMentoringSection = memo(function LiveMentoringSection({
  liveMentoring,
}: LiveMentoringSectionProps) {
  return (
    <section className="w-full bg-[#0C0A1D] py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="text-center text-xl font-bold text-[#B49AFF] md:text-2xl">
          {liveMentoring.title}
        </h2>
        <p className="mt-4 text-center text-sm text-gray-300 md:text-base">
          {liveMentoring.subCopy1}
        </p>

        {/* 영상 임베딩 */}
        <div className="mx-auto mt-8 max-w-[900px]">
          {liveMentoring.videoUrl ? (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                src={liveMentoring.videoUrl}
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
                <p className="mt-3 text-sm text-gray-500">
                  영상이 준비 중입니다
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-gray-300 md:text-base">
          {liveMentoring.subCopy2}
        </p>
      </div>
    </section>
  );
});

export default LiveMentoringSection;
