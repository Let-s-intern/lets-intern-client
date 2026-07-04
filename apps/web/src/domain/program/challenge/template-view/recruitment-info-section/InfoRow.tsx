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
      <p className="text-xsmall16 text-neutral-0 md:text-xsmall16 whitespace-pre-line font-medium">
        {value}
      </p>
    </div>
  );
};

export default InfoRow;
