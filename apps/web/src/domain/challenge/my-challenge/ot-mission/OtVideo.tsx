const convertToEmbedUrl = (url: string) => {
  // YouTube 링크 패턴들
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  return null;
};

interface Props {
  vodLink: string;
}

function OtVideo({ vodLink }: Props) {
  const youtubeEmbedUrl = convertToEmbedUrl(vodLink);

  if (!youtubeEmbedUrl) return null;

  return (
    <section className="mt-8 flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-neutral-0">OT 영상</h3>
      <div className="relative flex aspect-video items-center justify-center rounded-sm bg-neutral-95">
        <iframe
          src={youtubeEmbedUrl}
          className="h-full w-full rounded-sm"
          allowFullScreen
          title="OT 영상"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </section>
  );
}

export default OtVideo;
