interface IntroTitleProps {
  title: string;
  lineWidth: string;
}

const IntroTitle = ({ title, lineWidth }: IntroTitleProps) => (
  <div className="relative flex flex-col md:items-center">
    <h2 className="text-1-bold xl:text-1.25-bold z-10">{title}</h2>
    <div
      className={`absolute top-3 h-3 xl:top-4 ${lineWidth} bg-primary-xlight/60`}
    />
  </div>
);

export default IntroTitle;
