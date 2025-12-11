import { ReactNode } from 'react';

function Heading3({ children }: { children: ReactNode }) {
  return <h3 className="text-small18 font-semibold">{children}</h3>;
}

export default Heading3;
