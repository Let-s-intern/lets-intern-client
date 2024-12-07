import { memo } from 'react';

const Heading2 = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-xsmall16 font-semibold">{children}</h2>;
};

export default memo(Heading2);
