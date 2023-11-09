interface TabBarProps {
  children: React.ReactNode;
}

const TabBar = ({ children }: TabBarProps) => {
  return (
    <div className="fixed left-0 top-16 z-40 w-full bg-neutral-white">
      <div className="mx-auto max-w-5xl">
        <div className="container mx-auto flex justify-between px-5 pb-[2px] sm:justify-start sm:gap-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TabBar;
