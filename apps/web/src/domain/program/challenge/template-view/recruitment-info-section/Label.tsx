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
      className="text-xsmall16 md:text-xsmall16 font-semibold"
      style={{ color: themeColor }}
    >
      {children}
    </span>
  );
};

export default Label;
