import { memo } from 'react';

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
}

const Label = ({ children, htmlFor }: LabelProps) => {
  return (
    <label htmlFor={htmlFor} className="px-2.5 text-xsmall14 font-semibold">
      {children}
    </label>
  );
};

export default memo(Label);
