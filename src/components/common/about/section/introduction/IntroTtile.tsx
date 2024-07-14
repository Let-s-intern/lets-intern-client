interface IntroTitleProps {
  title: string;
  lineWidth: string;
}

const IntroTitle = ({ title, lineWidth }: IntroTitleProps) => (
  <div className="relative">
    <h2 className="text-1-bold">{title}</h2>
    <div
      className={`absolute top-3 h-3 ${lineWidth} bg-primary-xlight/60`}
    ></div>
  </div>
);

export default IntroTitle;
