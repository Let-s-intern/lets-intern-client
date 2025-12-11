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
  styles: {
    primaryColor: string;
    primaryLightColor: string;
    borderColor: string;
  };
}

const DifferentCard = ({
  order,
  title,
  options,
  imageUrl,
  styles,
}: DifferentCardProps) => {
  const isDesktop = useMediaQuery('(min-width: 991px)');

  return (
    <div
      className="flex w-full flex-col gap-x-[50px] gap-y-6 rounded-md border p-4 pb-[26px] text-black md:flex-row md:items-center md:px-10 md:pt-6"
      style={{
        backgroundColor: styles.primaryLightColor,
        borderColor: styles.borderColor,
      }}
    >
      {imageUrl && (
        <img
          src={isDesktop ? imageUrl.desktop : imageUrl.mobile}
          alt="different"
          className="w-full rounded-t-md md:w-[288px] md:rounded-md lg:w-[464px] lg:translate-y-[26px] lg:rounded-b-none"
        />
      )}
      <div className="flex w-full flex-col gap-y-3">
        {order && (
          <p
            className="flex w-fit rounded-md px-[14px] py-1.5 text-xsmall14 font-semibold text-white lg:text-small18"
            style={{
              backgroundColor: styles.primaryColor,
            }}
          >{`Point ${order}`}</p>
        )}
        <div className="flex w-full flex-col gap-y-4">
          <h4 className="whitespace-pre-line text-small18 font-bold lg:text-medium22">
            {title}
          </h4>
          <div className="flex w-full flex-col gap-y-1">
            {options.map((option, index) => (
              <div key={index} className="flex items-start">
                <ChevronDown
                  className="shrink-0"
                  style={{ color: styles.primaryColor }}
                  width={24}
                  height={24}
                />
                <p className="whitespace-pre text-wrap break-keep pt-px text-xsmall14 font-medium text-neutral-30 md:pt-0 lg:text-small18">
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
