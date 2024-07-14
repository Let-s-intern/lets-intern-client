interface AboutTitleDarkProps {
  subTitle: string;
  title: string;
}

const AboutTitleDark = ({ subTitle, title }: AboutTitleDarkProps) => {
  return (
    <div className="mb-[3.75rem] flex flex-col gap-2">
      <span className="text-1-bold text-primary-light">{subTitle}</span>
      <h1 className="text-1.25-bold text-static-100">{title}</h1>
    </div>
  );
};

export default AboutTitleDark;
