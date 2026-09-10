import { EARLY_BIRD } from '../data/earlyBird';

// 얼리버드 최상단 풀폭 배너. 이미지 asset 이 없으면 렌더하지 않는다(빈 공간 방지).
export default function EarlyBirdBanner() {
  if (!EARLY_BIRD.image) return null;

  const img = (
    <picture>
      {EARLY_BIRD.imageMobile && (
        <source media="(max-width: 600px)" srcSet={EARLY_BIRD.imageMobile} />
      )}
      <img
        className="early-bird-img"
        src={EARLY_BIRD.image}
        alt={EARLY_BIRD.alt}
      />
    </picture>
  );

  return (
    <section className="early-bird">
      {EARLY_BIRD.href ? (
        <a href={EARLY_BIRD.href} target="_blank" rel="noopener noreferrer">
          {img}
        </a>
      ) : (
        img
      )}
    </section>
  );
}
