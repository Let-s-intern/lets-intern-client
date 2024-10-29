import { ReactNode } from 'react';

function Description({ children }: { children: ReactNode }) {
  return (
    <p className="text-xsmall14 text-neutral-30 lg:text-small20">{children}</p>
  );
}

export default Description;
