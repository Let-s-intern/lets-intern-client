import { ReactNode } from 'react';
import Label from './Label';

const InfoRow = ({
  label,
  value,
  themeColor,
}: {
  label: string;
  value: ReactNode;
  themeColor: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label themeColor={themeColor}>{label}</Label>
      <p className="whitespace-pre-line text-xsmall16 font-medium text-neutral-0 md:text-xsmall16">
        {value}
      </p>
    </div>
  );
};

export default InfoRow;
