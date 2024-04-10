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
    <li className="w-full flex-auto flex-shrink-0 flex-grow-0 xs:w-[23rem]">
      <div className="rounded-xs w-full overflow-hidden">
        <img src={imageSrc} alt={imageAlt} className="w-full" />
      </div>
      <p className="text-xs-0.875-medium mt-3">{description}</p>
    </li>
  );
};

export default AdvantageItem;
