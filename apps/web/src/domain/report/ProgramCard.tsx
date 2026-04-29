interface CardProps {
  imgSrc: string;
  imgAlt: string;
  title: string;
  content: { label: string; text: string }[];
}

const ProgramCard = ({ imgSrc, imgAlt, title, content }: CardProps) => {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-neutral-90 h-20 w-28 overflow-hidden rounded-sm">
        <img className="h-auto w-full" src={imgSrc} alt={imgAlt} />
      </div>
      <div>
        <span className="font-semibold">{title}</span>
        <div className="mt-3">
          {content.map(({ label, text }) => (
            <div key={label} className="flex gap-4">
              <span className="text-xxsmall12 shrink-0 font-medium">
                {label}
              </span>
              <span className="text-xxsmall12 text-primary-dark font-medium">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
