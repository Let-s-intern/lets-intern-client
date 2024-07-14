interface AboutTitleProps {
  subTitle: string;
  title: string;
}

const AboutTitle = ({ subTitle, title }: AboutTitleProps) => {
  return (
    <div className="mb-10 flex flex-col gap-2">
      <span className="text-1-bold text-neutral-40">{subTitle}</span>
      <h1 className="text-1.25-bold">{title}</h1>
    </div>
  );
};

export default AboutTitle;
