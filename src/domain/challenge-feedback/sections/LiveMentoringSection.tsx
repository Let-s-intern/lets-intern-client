import { memo } from 'react';
import type { LiveMentoring } from '../types';

interface LiveMentoringSectionProps {
  liveMentoring: LiveMentoring;
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
        <p className="mt-3 text-base text-gray-500">영상이 준비 중입니다</p>
      </div>
    </div>
  );
}

function renderTextWithMobileBreak(text: string) {
  const parts = text.split(', ');
  if (parts.length <= 1) return text;
  return parts.map((part, i) => (
    <span key={i}>
      {i > 0 && ', '}
      {i > 0 && <br className="md:hidden" />}
      {part}
    </span>
  ));
}

const LiveMentoringSection = memo(function LiveMentoringSection({
  liveMentoring,
}: LiveMentoringSectionProps) {
  return (
    <section className="flex w-full flex-col items-center justify-center bg-[#0e0c22] py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="text-center text-lg font-bold text-white md:text-2xl">
          <span className="text-[#B49AFF]">1:1 LIVE</span> 피드백,
          <br className="md:hidden" />
          영상으로 미리 확인하세요!
        </h2>
        <p className="mb-10 mt-4 text-center text-sm text-gray-300 md:text-lg">
          {renderTextWithMobileBreak(liveMentoring.subCopy1)}
        </p>
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-6">
        <VideoEmbed videoUrl={liveMentoring.videoUrl} />
      </div>

      <p className="mt-8 text-center text-sm text-gray-300 md:text-lg">
        {renderTextWithMobileBreak(liveMentoring.subCopy2)}
      </p>
    </section>
  );
});

export default LiveMentoringSection;
