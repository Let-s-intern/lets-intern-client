import { ReactNode } from 'react';

function Description({ children }: { children: ReactNode }) {
  return (
    <p className="whitespace-pre-line text-xsmall14 text-neutral-30 lg:text-small20">
      {children}
    </p>
  );
}

export default Description;
