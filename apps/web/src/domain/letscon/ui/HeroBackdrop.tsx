// 시안 2000 x 975 기준 좌표. 별자리는 데스크톱 시안에만 있다
const CONSTELLATION = [
  [272, 517],
  [497, 404],
  [703, 455],
  [948, 334],
  [1172, 390],
  [1398, 264],
  [1623, 306],
];
const STARS = [
  [121, 156],
  [710, 302],
  [1559, 91],
  [79, 631],
  [473, 877],
  [1585, 819],
];

const [GOAL_X, GOAL_Y] = CONSTELLATION[CONSTELLATION.length - 1];

export function HeroBackdrop() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 2000 975"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 hidden h-full w-full md:block"
    >
      <polyline
        points={CONSTELLATION.map((point) => point.join(',')).join(' ')}
        fill="none"
        stroke="#fff"
        strokeOpacity=".2"
        strokeWidth="2"
      />
      {CONSTELLATION.slice(0, -1).map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="4.5" fill="#fff" opacity=".75" />
      ))}
      {STARS.map(([x, y], index) => (
        <circle
          key={x}
          data-twinkle
          style={{ animationDelay: `${index * 0.9}s` }}
          cx={x}
          cy={y}
          r="3"
          fill="#fff"
          opacity=".3"
        />
      ))}
      <circle cx={GOAL_X} cy={GOAL_Y} r="43" fill="#ffe066" opacity=".1" />
      <circle cx={GOAL_X} cy={GOAL_Y} r="24" fill="#ffe066" opacity=".3" />
      <circle cx={GOAL_X} cy={GOAL_Y} r="10" fill="#ffe066" />
    </svg>
  );
}
