interface AboutTitleDarkProps {
  subTitle: string;
  mainTitle: string;
}

const AboutTitleDark = ({ subTitle, mainTitle }: AboutTitleDarkProps) => {
  return (
    <div className="flex flex-col gap-2 md:items-center">
      <span className="text-1-bold xl:text-1.25-bold text-primary-light">
        {subTitle}
      </span>
      <h1 className="text-1.25-bold md:text-1.5-bold xl:text-1.75-bold text-static-100">
        {mainTitle}
      </h1>
    </div>
  );
};

export default AboutTitleDark;
