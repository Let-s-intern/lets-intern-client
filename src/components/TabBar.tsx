import { useEffect, useState } from 'react';
import cn from 'classnames';

interface TabBarProps {
  itemCount?: number;
  children: React.ReactNode;
  className?: string;
}

const TabBar = ({ itemCount, children, className }: TabBarProps) => {
  const [justifyBetweenStyle, setJustifyBetweenStyle] = useState(
    ' min-[350px]:justify-start min-[350px]:gap-10',
  );

  useEffect(() => {
    if (itemCount) {
      switch (itemCount) {
        case 3:
          setJustifyBetweenStyle(
            ' min-[350px]:justify-start min-[350px]:gap-10',
          );
          break;
        case 4:
          setJustifyBetweenStyle(
            ' min-[450px]:justify-start min-[450px]:gap-10',
          );
          break;
        default:
          break;
      }
    }
  }, [itemCount]);

  return (
    <div
      className={cn(
        'fixed left-0 top-16 z-30 h-8 w-full bg-neutral-white px-[1.5rem] md:pr-[2.5rem]',
        {
          [className as string]: className,
        },
      )}
    >
      <div className="mx-auto max-w-[1024px]">
        <div className={`mx-auto flex justify-between${justifyBetweenStyle}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default TabBar;
