import { CSSProperties, ReactNode } from 'react';

function Badge({
  children,
  style,
}: {
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span
      className="absolute -top-6 left-6 z-10 -rotate-12 rounded-sm bg-[#14BCFF] px-2.5 py-1 text-xsmall16 font-bold text-white md:px-4 md:text-small20 md:font-semibold"
      style={style}
    >
      {children}
    </span>
  );
}

export default Badge;
