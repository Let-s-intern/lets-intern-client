import { useMediaQuery } from '@mui/material';
import { ReactNode } from 'react';

export interface CardProps {
  order: number;
  title: ReactNode;
  description: ReactNode;
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

const Card = ({ order, title, description, imageUrl, styles }: CardProps) => {
  const isDesktop = useMediaQuery('(min-width: 991px)');

  return (
    <div
      className="mx-auto flex w-full max-w-[1000px] flex-col gap-x-[50px] gap-y-6 rounded-md border p-4 pb-[26px] text-black md:flex-row md:items-center md:px-10 md:pt-6"
      style={{
        backgroundColor: styles.primaryLightColor,
        borderColor: styles.borderColor,
      }}
    >
      {imageUrl && (
        <img
          src={isDesktop ? imageUrl.desktop : imageUrl.mobile}
          alt="1:1 멘토링 이미지"
          className="w-full flex-none rounded-t-md md:w-[288px] md:rounded-md lg:w-[464px] lg:translate-y-[26px] lg:rounded-b-none"
          style={{ width: isDesktop ? '464px' : '288px' }}
        />
      )}
      <div className="flex w-full flex-col gap-y-3">
        {order && (
          <p
            className="text-xsmall14 lg:text-small18 flex w-fit rounded-md px-[14px] py-1.5 font-semibold text-white"
            style={{
              backgroundColor: styles.primaryColor,
            }}
          >{`Point ${order}`}</p>
        )}
        <div className="flex w-full flex-col gap-y-4">
          <h4 className="text-small18 lg:text-medium22 whitespace-pre-line font-bold">
            {title}
          </h4>
          <div className="flex w-full flex-col md:gap-y-1">{description}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
