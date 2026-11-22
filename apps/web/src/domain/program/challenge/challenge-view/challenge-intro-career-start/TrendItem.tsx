import CircularBox from '@/common/box/CircularBox';
import { ReactNode } from 'react';

const TrendItem = ({
  number,
  title,
  description,
  imageSrc,
  imageAlt,
}: {
  number: number;
  title: ReactNode;
  description: ReactNode;
  imageSrc: string;
  imageAlt: string;
}) => (
  <div>
    <div className="mb-8 break-keep md:mb-20 md:flex md:items-center md:justify-between min-[1025px]:mb-14 min-[1025px]:flex-col min-[1025px]:items-stretch min-[1025px]:gap-6">
      <div className="md:flex md:gap-3">
        <CircularBox className="mb-2 h-5 w-5 shrink-0 bg-primary text-xsmall14 font-semibold md:mt-0.5 md:h-8 md:w-8 md:text-small20">
          {number}
        </CircularBox>
        <div>
          <Title>{title}</Title>
          <Paragraph>{description}</Paragraph>
        </div>
      </div>
      <img
        src={imageSrc}
        alt={imageAlt}
        className="max-w-full min-[1025px]:mx-auto"
      />
    </div>
  </div>
);

function Title({ children }: { children?: ReactNode }) {
  return (
    <span className="text-small18 font-semibold text-neutral-0 md:text-medium22 md:font-bold">
      {children}
    </span>
  );
}

function Paragraph({ children }: { children?: ReactNode }) {
  return (
    <p className="mb-5 mt-2.5 text-xsmall14 text-neutral-45 md:text-small18">
      {children}
    </p>
  );
}

export default TrendItem;
