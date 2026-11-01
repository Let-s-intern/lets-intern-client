import type { ReactNode } from 'react';

interface ConnectionLineProps {
  viewBox: string;
  points: [number, number][];
  className: string;
  children?: ReactNode;
}

// 시안 배경의 점과 선 장식
export function ConnectionLine({
  viewBox,
  points,
  className,
  children,
}: ConnectionLineProps) {
  return (
    <svg
      aria-hidden
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <polyline
        points={points.map((point) => point.join(',')).join(' ')}
        fill="none"
        stroke="#fff"
        strokeOpacity={0.2}
        strokeWidth={1.5}
      />
      {points.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={3.5} fill="#fff" />
      ))}
      {children}
    </svg>
  );
}
