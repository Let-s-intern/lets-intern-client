import { useState } from 'react';

interface TooltipProps {
  alt: string;
  children: React.ReactNode;
}

const Tooltip = ({ alt, children }: TooltipProps) => {
  const [isShow, setIsShow] = useState(false);

  return (
    <div className="relative h-5 w-5 cursor-pointer">
      <img
        aria-describedby="helper"
        className="h-auto w-full"
        src="/icons/message-question-circle.svg"
        alt={alt}
        onMouseEnter={() => setIsShow(true)}
        onMouseLeave={() => setIsShow(false)}
      />
      {isShow && (
        <div
          id="helper"
          role="tooltip"
          className="absolute -top-1 left-8 z-10 w-52 rounded-xs bg-neutral-95 px-4 py-3 text-xxsmall12 text-neutral-40 drop-shadow-[0_0_4px_rgba(0,0,0,0.32)]"
        >
          {children}
          <div className="absolute -left-1 top-2 h-3 w-3 rotate-45 bg-neutral-95" />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
