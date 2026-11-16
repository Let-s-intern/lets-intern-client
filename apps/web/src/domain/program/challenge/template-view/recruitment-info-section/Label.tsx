import { ReactNode } from 'react';

const Label = ({
  children,
  themeColor,
}: {
  children?: ReactNode;
  themeColor: string;
}) => {
  return (
    <span
      className="text-xsmall16 font-semibold md:text-xsmall16"
      style={{ color: themeColor }}
    >
      {children}
    </span>
  );
};

export default Label;
