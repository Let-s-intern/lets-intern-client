import { memo } from 'react';

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
}

const Label = ({ children, htmlFor }: LabelProps) => {
  return (
    <label htmlFor={htmlFor} className="text-xsmall14 px-2.5 font-semibold">
      {children}
    </label>
  );
};

export default memo(Label);
