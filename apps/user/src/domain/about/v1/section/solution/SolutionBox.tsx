interface SolutionBoxProps {
  title: string;
  imgWidthClassName: string;
  imgName: string;
  description: string;
}

const SolutionBox = ({
  title,
  imgWidthClassName,
  imgName,
  description,
}: SolutionBoxProps) => {
  return (
    <div key={title} className="flex items-center gap-6 md:flex-col">
      <img
        className={`h-full ${imgWidthClassName}`}
        src={`/icons/${imgName}`}
      />
      <div className="flex flex-col gap-2">
        <h2 className="text-1-bold xl:text-1.25-bold text-primary md:text-center">
          {title}
        </h2>
        <p className="text-0.875 xl:text-1.125 text-neutral-40 md:text-center">
          {description}
        </p>
      </div>
    </div>
  );
};

export default SolutionBox;
