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
    <div className="mb-8 md:mb-20 md:flex md:items-center md:justify-between">
      <div className="md:flex md:gap-3">
        <CircularBox className="bg-primary text-xsmall14 md:text-small20 mb-2 h-5 w-5 shrink-0 font-semibold md:mt-0.5 md:h-8 md:w-8">
          {number}
        </CircularBox>
        <div>
          <Title>{title}</Title>
          <Paragraph>{description}</Paragraph>
        </div>
      </div>
      <img src={imageSrc} alt={imageAlt} />
    </div>
  </div>
);

function Title({ children }: { children?: ReactNode }) {
  return (
    <span className="text-small18 text-neutral-0 md:text-medium22 font-semibold md:font-bold">
      {children}
    </span>
  );
}

function Paragraph({ children }: { children?: ReactNode }) {
  return (
    <p className="text-xsmall14 text-neutral-45 md:text-small18 mb-5 mt-2.5">
      {children}
    </p>
  );
}

export default TrendItem;
