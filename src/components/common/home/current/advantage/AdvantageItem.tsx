interface AdvantageItemProps {
  description: string;
  imageSrc: string;
  imageAlt: string;
}

const AdvantageItem = ({
  description,
  imageSrc,
  imageAlt,
}: AdvantageItemProps) => {
  return (
    <li className="w-full flex-shrink-0 xs:w-[23rem]">
      <div className="w-full overflow-hidden rounded-xs">
        <img src={imageSrc} alt={imageAlt} className="w-full" />
      </div>
      <p className="text-xs-0.875-medium mt-3 text-neutral-0">{description}</p>
    </li>
  );
};

export default AdvantageItem;
