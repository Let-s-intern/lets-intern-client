interface AboutTitleProps {
  subTitle: string;
  mainTitle: string;
}

const AboutTitle = ({ subTitle, mainTitle }: AboutTitleProps) => {
  return (
    <div className="mb-10 flex flex-col gap-2 md:mb-[3.75rem] md:items-center">
      <span className="text-1-bold xl:text-1.25-bold text-neutral-40">
        {subTitle}
      </span>
      <h1 className="text-1.25-bold sm:text-1.5-bold xl:text-1.75-bold">
        {mainTitle}
      </h1>
    </div>
  );
};

export default AboutTitle;
