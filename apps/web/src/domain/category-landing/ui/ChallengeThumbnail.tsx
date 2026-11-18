import { resolveChallengeThumbnail } from '../challengeThumbnail';

interface ChallengeThumbnailProps {
  title: string;
  displayTitle: string;
  /** 기본 썸네일이 없는 유형에 쓰는 등록 썸네일 */
  fallbackSrc?: string | null;
}

/**
 * 챌린지 썸네일. 기본 이미지가 있으면 그 위에(필요하면) 제목을 얹는다.
 * 얹는 위치·크기는 어드민 생성기(1146×860 캔버스, x 80, 기준선 746.5, 84px)를 비율로 옮겼다
 */
const ChallengeThumbnail = ({
  title,
  displayTitle,
  fallbackSrc,
}: ChallengeThumbnailProps) => {
  const resolved = resolveChallengeThumbnail(title, displayTitle);
  const src = resolved?.src ?? fallbackSrc;
  if (!src) return null;
  return (
    <div className="relative h-full w-full [container-type:inline-size]">
      {/* 썸네일 출처가 여러 버킷이라 next/image 도메인 설정에 묶지 않는다 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-full w-full object-cover" />
      {resolved?.overlayTitle && (
        <span
          className="absolute whitespace-nowrap font-bold leading-none text-white"
          style={{
            left: '6.98%',
            bottom: `${((860 - 746.5) / 860) * 100}%`,
            fontSize: '7.33cqw',
            letterSpacing: '-0.022em',
            textShadow: `0 0 1.75cqw ${resolved.shadowColor}`,
          }}
        >
          {resolved.overlayTitle}
        </span>
      )}
    </div>
  );
};

export default ChallengeThumbnail;
