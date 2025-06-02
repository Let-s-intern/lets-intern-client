import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center gap-2.5 rounded-[100px] px-4 py-1.5 text-sm font-bold leading-none tracking-tight">
      <div className="my-auto self-stretch bg-clip-text">{children}</div>
    </div>
  );
};

export default Badge;
