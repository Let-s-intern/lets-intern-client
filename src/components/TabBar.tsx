import { useEffect, useState } from 'react';

interface TabBarProps {
  itemCount?: number;
  children: React.ReactNode;
}

const TabBar = ({ itemCount, children }: TabBarProps) => {
  const [justifyBetweenStyle, setJustifyBetweenStyle] = useState('');

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
    <div className="fixed left-0 top-16 z-30 h-9 w-full bg-neutral-white">
      <div className="mx-auto max-w-5xl">
        <div
          className={` container mx-auto flex justify-between px-5 pb-[2px]${justifyBetweenStyle}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default TabBar;
