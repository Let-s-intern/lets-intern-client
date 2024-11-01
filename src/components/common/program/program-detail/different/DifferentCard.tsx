import ChevronDown from '@/assets/icons/chevron-down.svg?react';
import { useMediaQuery } from '@mui/material';

export interface DifferentCardProps {
  order?: number;
  title: string;
  options: string[];
  imageUrl?: {
    desktop: string;
    mobile: string;
  };
}

const DifferentCard = ({
  order,
  title,
  options,
  imageUrl,
}: DifferentCardProps) => {
  const isDesktop = useMediaQuery('(min-width: 991px)');
  return (
    <div className="flex w-full flex-col gap-x-[50px] gap-y-6 rounded-md bg-neutral-95 p-4 pb-[26px] text-black md:flex-row md:items-center md:px-10 md:py-[30px]">
      {imageUrl && (
        <img
          src={isDesktop ? imageUrl.desktop : imageUrl.mobile}
          alt="different"
          className="w-full rounded-md md:w-[484px]"
        />
      )}
      <div className="flex flex-1 flex-col gap-y-3">
        {order && (
          <p className="flex w-fit rounded-md bg-challenge px-[14px] py-1.5 text-xsmall14 font-semibold text-white md:text-small18">{`Point ${order}`}</p>
        )}
        <div className="flex w-full flex-col gap-y-4">
          <h4 className="whitespace-pre text-small18 font-bold md:text-medium22">
            {title}
          </h4>
          <div className="flex w-full flex-col gap-y-1">
            {options.map((option, index) => (
              <div key={index} className="flex items-start">
                <ChevronDown
                  className="shrink-0 text-challenge"
                  width={24}
                  height={24}
                />
                <p className="whitespace-pre text-wrap break-keep pt-px text-xsmall14 font-medium text-neutral-30 md:pt-0 md:text-small18">
                  {option}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifferentCard;
