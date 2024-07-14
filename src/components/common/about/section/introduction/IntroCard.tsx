interface IntroCardProps {
  title: string;
  subTitle: string;
  description: string;
}

const IntroCard = ({ title, subTitle, description }: IntroCardProps) => (
  <div className="w-full rounded-md bg-primary p-5">
    <div className="mb-3">
      <h3 className="text-1-semibold text-static-100">{title}</h3>
      <h4 className="text-0.875-bold text-[#8288F8]">{subTitle}</h4>
    </div>
    <p className="text-0.875 text-neutral-80">{description}</p>
  </div>
);

export default IntroCard;
