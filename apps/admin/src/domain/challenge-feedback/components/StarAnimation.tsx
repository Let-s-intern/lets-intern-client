import { memo } from 'react';

const STARS = [
  { char: '✦', top: '10%', left: '8%', size: 'text-lg', delay: 0 },
  { char: '✧', top: '20%', left: '85%', size: 'text-sm', delay: 1.2 },
  { char: '✦', top: '60%', left: '5%', size: 'text-xs', delay: 0.6 },
  { char: '✧', top: '15%', left: '92%', size: 'text-base', delay: 1.8 },
  { char: '✦', top: '70%', left: '90%', size: 'text-xs', delay: 0.3 },
  { char: '✧', top: '40%', left: '3%', size: 'text-sm', delay: 2.1 },
  { char: '✦', top: '80%', left: '15%', size: 'text-xs', delay: 1.5 },
  { char: '✧', top: '30%', left: '95%', size: 'text-xs', delay: 0.9 },
] as const;

const KEYFRAMES = `@keyframes cf-twinkle{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}`;

const StarAnimation = memo(function StarAnimation() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      {STARS.map((star, i) => (
        <span
          key={i}
          className={`pointer-events-none absolute ${star.size} text-white/60`}
          style={{
            top: star.top,
            left: star.left,
            animation: `cf-twinkle 2.5s ease-in-out ${star.delay}s infinite`,
          }}
        >
          {star.char}
        </span>
      ))}
    </>
  );
});

export default StarAnimation;
